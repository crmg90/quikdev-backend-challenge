import { hashPassword } from '@foal/core';
import {BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn} from 'typeorm';
import {Profile} from './profile.entity';
import { Point } from 'geojson';

@Entity('users')
export class User extends BaseEntity{

  @ObjectIdColumn({name: '_id'})
  _id: ObjectID;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({nullable: false})
  name: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  birthdate: Date;

  @Column({nullable: false})
  address: string;

  @Column({nullable: false})
  addressNumber: string;

  @Column()
  primaryPhone: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable: false})
  password: string;

  @Column()
  profiles: Profile[];

  @Column({name: 'coordinates', type: 'geometry'})
  coordinates: Point;


  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }

}
