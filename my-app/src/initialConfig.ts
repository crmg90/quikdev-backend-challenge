import {Profile, User} from './app/entities';
import * as moment from 'moment';
import {getMongoRepository} from 'typeorm';

class InitialConfig {
    static async main(){

        await this.createProfiles();
    }

    static async createProfiles(){
        const count: number = await Profile.count()
        if(count == 0){
            const profiles: Profile[] = [];
            const profileAdmin = new Profile();
            profileAdmin.name = 'ADMIN';
            let result: Profile = await profileAdmin.save();
            profiles.push(result)

            const profileUser = new Profile();
            profileUser.name = 'USER';
            result = await profileUser.save();
            profiles.push(result)

            await this.createUsers(profiles)
        }
    }
    static async createUsers(profiles: Profile[]){
        const count: number = await User.count()
        if(count == 0) {



            const clay = new User();
            clay.email = 'clayrmg0@gmail.com';
            clay.name = 'Clay Gomes'
            clay.username = 'clay'
            clay.profiles = profiles;
            await clay.setPassword('teste');
            await clay.save();

            const laura = new User();
            laura.email = 'laura@gmail.com';
            laura.name = 'Laura'
            laura.username = 'laura233'
            laura.birthdate = moment.utc('1990-04-04', 'YYYY-MM-DD').toDate();
            laura.coordinates = {type:'Point',coordinates:[-23.636981527942996,-46.63508766290101]}
            laura.address = 'Conj 123'
            laura.addressNumber = '10'
            laura.primaryPhone = '(91) 99111-2222'
            laura.description = 'Sempre em movimento'
            laura.profiles = profiles.filter(p => p.name == 'USER');
            await laura.setPassword('teste');
            await laura.save();

            const pedro = new User();
            pedro.email = 'pedro@gmail.com';
            pedro.name = 'Pedro'
            pedro.username = 'pedrinho'
            pedro.coordinates = {type:'Point',coordinates:[-23.63261749870414,-46.63240545400015]}
            pedro.address = 'Edificio Rosas, torre 2'
            pedro.addressNumber = 'apto 301'
            pedro.primaryPhone = '(91) 3232-2222'
            pedro.profiles = profiles.filter(p => p.name == 'USER');
            await pedro.setPassword('teste');
            await pedro.save();

            const arthur = new User();
            arthur.email = 'arthur@gmail.com';
            arthur.name = 'Arthur'
            arthur.username = 'arthur'
            arthur.coordinates = {type:'Point',coordinates:[-23.537654075009616,-46.678925686400014]}
            arthur.address = 'endereço 2'
            arthur.addressNumber = 'n. 202'
            arthur.profiles = profiles.filter(p => p.name == 'USER');
            await arthur.setPassword('teste');
            await arthur.save();

            const marcos = new User();
            marcos.email = 'marcos@gmail.com';
            marcos.name = 'Marcos'
            marcos.username = 'marquinhos'
            marcos.address = 'endereço 2'
            marcos.addressNumber = 'n. 202'
            marcos.profiles = profiles.filter(p => p.name == 'USER');
            await marcos.setPassword('teste');
            await marcos.save();

            await getMongoRepository(User).createCollectionIndex({'coordinates': '2dsphere'} )

        }
    }

}

export {InitialConfig}
