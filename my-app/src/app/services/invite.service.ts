import {Invite, User} from '../entities';
import {ObjectID} from 'mongodb';

export class InviteService {
    async send(userRequest: User, userTargetId: string): Promise<Invite | null> {
        //check userTarget exists
        const userTarget: User | undefined = await User.findOne(userTargetId);
        if (userTarget == null ) {
            return null;
        }

        console.log(userTarget._id)
        //check another invitation active or accepted (not rejected)
        const invites  = await Invite.find({where:{
                $or: [
                    {userSend: userTarget._id.toString(), userTarget: userRequest._id.toString()},
                    {userTarget: userTarget._id.toString(), userSend: userRequest._id.toString()}
                ],
                accepted: {
                    $not: {
                        $in: [false]
                    }
                }
            }})
        // invites active
        if(invites.length > 0){
            return null;
        }

        const invite = new Invite();
        invite.userSend = userRequest._id.toString();
        invite.userTarget = userTarget._id.toString();
        return await invite.save();
    }

    async accept(userRequest: User, invitiationId: string): Promise<Invite | null> {

        //check another invitation active (not accepted, not rejected)
        const invite  = await Invite.findOne({where:{
                userTarget: userRequest._id,
                _id: ObjectID.createFromHexString(invitiationId),
                accepted: {
                    $not: {
                        $in: [true, false]
                    }
                }
            }})
        // invites active
        if(invite == undefined){
            return null;
        }
        invite.accepted = true;

        return await invite.save();
    }

    async reject(userRequest: User, invitiationId: string): Promise<Invite | null> {
        //check another invitation active (not accepted, not rejected)
        const invite  = await Invite.findOne({where:{
                userTarget: userRequest._id,
                _id: ObjectID.createFromHexString(invitiationId),
                accepted: {
                    $not: {
                        $in: [true, false]
                    }
                }
            }})
        // invites active
        if(invite == undefined){
            return null;
        }
        invite.accepted = false;

        return await invite.save();
    }
}
