import {Invite, Profile, User} from '../entities';
import * as _ from 'lodash';
import {ObjectID} from 'mongodb';

export class UserService {

    async findUser( u: User): Promise<User | undefined> {
        return await User.findOne({where: {email: u.email}});
    }

    async findUserById( id: string): Promise<User | undefined> {
        return await User.findOne(id);
    }

    async updateUser( u: User, userRequest: any): Promise<User | undefined> {
        let user: User | undefined = await User.findOne(u._id);
        if(user != null){
            user = _.merge(user,userRequest);
            await user?.save();
            return user;
        }
        return undefined;
    }

    async createUser( userRequest: any): Promise<User> {
        let user = new User();
        user = _.merge(user, userRequest);
        // usar função para encriptar
        await user.setPassword(userRequest.password);
        const profile: Profile | undefined = await Profile.findOne({name: 'USER'})
        if(profile == undefined){
            throw 'Profile not found';
        }
        user.profiles = [profile]
        return await user.save();
    }

    async deleteUser( u: User): Promise<boolean> {
        const user: User | undefined = await User.findOne(u._id);
        if(user != null){
            await User.remove(user);
            return true;
        }
        return false;
    }

    async findUserExcept( u: User): Promise<User[] | undefined> {
        return await User.find({where: {email: {$not: {$in: [u.email]}}}});
    }

    async findFriends( u: User): Promise<User[]> {

        const invites = await Invite.find({
            where: {
                $or: [
                    {userSend:  u._id},
                    {userTarget:  u._id}
                ],
                accepted: true
            }
        })
        const ids = invites.map(i => i.userTarget == u._id.toString() ? ObjectID.createFromHexString(i.userSend)  :ObjectID.createFromHexString(i.userTarget))

        return await User.find({
            where: {
                _id: {
                    $in: ids
                }
            }
        });
    }

    async deleteFriend(u: User, friendId: string): Promise<boolean> {

        const invite = await Invite.findOne({
            where: {
                $or: [
                    {userSend:  u._id, userTarget: friendId},
                    {userTarget:  u._id, userSend: friendId}
                ],
                accepted: true
            }
        })
        if(invite != undefined){
            await Invite.remove(invite);
            return true;
        }else{
            return false
        }
    }

    async findPeoplesNearby( u: User, maxDistance: number): Promise<User[]> {
        const user: User | undefined = await User.findOne(u._id);
        if(user != null && user.coordinates != null) {
            const users = await User.find({
                where: {
                    coordinates: {
                        $nearSphere: {
                            $geometry: user.coordinates,
                            $maxDistance: maxDistance * 1000
                        }
                    }, _id: {$not: {$in: [user._id]}}
                }
            })
            return users;
        }else{
            return [];
        }
    }

    async findFriendsNearby( u: User, maxDistance: number): Promise<User[]> {
        const user: User | undefined = await User.findOne(u._id);
        if(user != null && user.coordinates != null) {
            const invites = await Invite.find({
                where: {
                    $or: [
                        {userSend:  u._id},
                        {userTarget:  u._id}
                    ],
                    accepted: true
                }
            })
            const ids = invites.map(i => i.userTarget == u._id.toString() ? ObjectID.createFromHexString(i.userSend)  :ObjectID.createFromHexString(i.userTarget))

            const users = await User.find({
                where: {
                    coordinates: {
                        $nearSphere: {
                            $geometry: user.coordinates,
                            $maxDistance: maxDistance * 1000
                        }
                    }, _id: {$in: ids}
                }
            })
            return users;
        }else{
            return [];
        }

    }
}
