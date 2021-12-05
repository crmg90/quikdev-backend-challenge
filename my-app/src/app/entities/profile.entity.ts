import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn} from 'typeorm';

@Entity('profiles')
export class Profile extends BaseEntity{

  @ObjectIdColumn()
  id: ObjectID;

  @Column({nullable: false})
  name: string;

}
