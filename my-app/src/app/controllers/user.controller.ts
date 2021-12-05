import {
  Context,
  Delete,
  dependency,
  Get, HttpResponseBadRequest,
  HttpResponseOK, Patch,
  Post,
  Put,
  ValidateBody, ValidatePathParam,
  ValidateQueryParam
} from '@foal/core';
import {JWTRequired} from '@foal/jwt';
import {UserService} from '../services';
import {morphism} from 'morphism';
import {IdNameMapper, UserMapper} from '../mapper';
import {createUserValidator, editUserValidator, updateUserLocationValidator} from './schemavalidators/user';


export class UserController {

  @dependency
  userService: UserService


  @JWTRequired()
  @Get('/')
  async get(ctx: Context) {
    const user = await this.userService.findUser(ctx.user);
    if(user == undefined){
      throw new HttpResponseBadRequest('user not found');
    }
    return new HttpResponseOK(morphism(UserMapper.map, user));
  }

  @Post('/')
  @ValidateBody(createUserValidator)
  async create(ctx: Context) {
    const user = await this.userService.createUser(ctx.request.body);
    return new HttpResponseOK(morphism(IdNameMapper.map, user));
  }

  @JWTRequired()
  @ValidateBody(editUserValidator)
  @Put('/')
  async edit(ctx: Context) {
    const user = await this.userService.updateUser(ctx.user, ctx.request.body);
    if(user == undefined){
      throw new HttpResponseBadRequest('user not found');
    }
    return new HttpResponseOK(morphism(UserMapper.map, user));
  }

  @JWTRequired()
  @ValidateBody(updateUserLocationValidator)
  @Patch('/')
  async updateLocation(ctx: Context) {
    const coordinates = {type:'Point',coordinates:[ctx.request.body.latitude,ctx.request.body.longitude]};
    const user = await this.userService.updateUser(ctx.user, {coordinates: coordinates});
    if(user == undefined){
      throw new HttpResponseBadRequest('user not found');
    }
    return new HttpResponseOK(morphism(UserMapper.map, user));
  }

  @JWTRequired()
  @Delete('/')
  async delete(ctx: Context) {
    const user = await this.userService.deleteUser(ctx.user);
    if(!user){
      throw new HttpResponseBadRequest('user not found');
    }
    return new HttpResponseOK();
  }


  @JWTRequired()
  @Get('/nearby')
  @ValidateQueryParam('distance', {type: 'number'})
  async findPeoplesNearby(ctx: Context) {
    const users = await this.userService.findPeoplesNearby(ctx.user, ctx.request.query.distance);
    return new HttpResponseOK(users.map(user => morphism(IdNameMapper.map, user)));
  }

  @JWTRequired()
  @Get('/friends')
  async getFriends(ctx: Context) {
    const users = await this.userService.findFriends(ctx.user);
    return new HttpResponseOK(users.map(user => morphism(IdNameMapper.map, user)));
  }

  @JWTRequired()
  @Delete('/friends/:id')
  @ValidatePathParam('id', {type: 'string'})
  async deleteFriend(ctx: Context) {
    const response = await this.userService.deleteFriend(ctx.user, ctx.request.params.id);
    if(!response){
      return new HttpResponseBadRequest('friend not found');
    }
    return new HttpResponseOK();
  }


  @JWTRequired()
  @Get('/friends-nearby')
  @ValidateQueryParam('distance', {type: 'number'})
  async findFriendsNearby(ctx: Context) {
    const users = await this.userService.findFriendsNearby(ctx.user, ctx.request.query.distance);
    return new HttpResponseOK(users.map(user => morphism(IdNameMapper.map, user)));
  }




}
