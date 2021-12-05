import {
  Context,
  Delete,
  dependency,
  Get,
  HttpResponseBadRequest,
  HttpResponseOK,
  Put,
  ValidateBody,
  ValidatePathParam
} from '@foal/core';
import {IsAdmin} from '../hooks';
import {JWTRequired} from '@foal/jwt';
import {editUserValidator} from './schemavalidators/user';
import {UserService} from '../services';
import {morphism} from 'morphism';
import {UserMapper} from '../mapper';

@JWTRequired()
@IsAdmin()
export class AdminController {

  @dependency
  userService: UserService


  @Get('/user/')
  async getAll(ctx: Context) {
    const users = await this.userService.findUserExcept(ctx.user);
    return new HttpResponseOK(users == null? [] : users.map(user => morphism(UserMapper.map, user)));
  }

  @ValidateBody(editUserValidator)
  @Put('/user/:id')
  @ValidatePathParam('id', {type: 'string'})
  async editAdmin(ctx: Context) {
    const user = await this.userService.findUserById(ctx.request.params.id);
    if(user == undefined){
      throw new HttpResponseBadRequest('User not found');
    }
    await this.userService.updateUser(user, ctx.request.body);
    return new HttpResponseOK();
  }

  @Delete('/user/:id')
  @ValidatePathParam('id', {type: 'string'})
  async deleteAdmin(ctx: Context) {
    const user = await this.userService.findUserById(ctx.request.params.id);
    if(user == undefined){
      throw new HttpResponseBadRequest('User not found');
    }
    await this.userService.deleteUser(user);
    return new HttpResponseOK();
  }

}
