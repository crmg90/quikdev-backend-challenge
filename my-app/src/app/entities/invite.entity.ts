// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn} from 'typeorm';

@Entity()
export class Invite extends BaseEntity{

  @ObjectIdColumn({name: '_id'})
  _id: ObjectID;

  @Column()
  userSend: string;

  @Column()
  userTarget: string;

  @Column()
  accepted: boolean | undefined;

}
