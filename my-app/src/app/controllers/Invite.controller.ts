import {Context, dependency, HttpResponseBadRequest, HttpResponseOK, Post, ValidatePathParam} from '@foal/core';
import {JWTRequired} from '@foal/jwt';
import {InviteService} from '../services';
import {Invite} from '../entities';

@JWTRequired()
export class InviteController {

  @dependency
  inviteService: InviteService;

  @Post('/user/:userId')
  @ValidatePathParam('userId', {type: 'string'})
  async sendInvitation(ctx: Context) {
    const invite: Invite | null = await this.inviteService.send(ctx.user, ctx.request.params.userId);
    if(invite == null){
      return new HttpResponseBadRequest('Invitation active');
    }
    return new HttpResponseOK();
  }

  @Post('/:id/accept')
  @ValidatePathParam('id', {type: 'string'})
  async accept(ctx: Context) {
    const invite: Invite | null = await this.inviteService.accept(ctx.user, ctx.request.params.id);
    if(invite == null){
      return new HttpResponseBadRequest('Invitation not found');
    }
    return new HttpResponseOK();
  }

  @Post('/:id/reject')
  @ValidatePathParam('id', {type: 'string'})
  async reject(ctx: Context) {
    const invite: Invite | null = await this.inviteService.reject(ctx.user, ctx.request.params.id);
    if(invite == null){
      return new HttpResponseBadRequest('Invitation not found');
    }
    return new HttpResponseOK();
  }

}
