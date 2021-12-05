import {
  Config,
  Context,
  Get, HttpResponseBadRequest, HttpResponseInternalServerError,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import {getSecretOrPrivateKey} from '@foal/jwt';
import {sign, verify} from 'jsonwebtoken';
import {User} from '../entities';

export class ApiController {

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }


  @Post('/oauth/token')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    try {
      const user = await User.findOne({email: ctx.request.body.email});
      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      const tokenLife = Config.get('settings.jwt.tokenLife');
      const refreshTokenLife = Config.get('settings.jwt.refreshTokenLife');
      const accessToken = sign(
          {email: user.email, _id: user._id, profiles: user.profiles},
          getSecretOrPrivateKey(),
          {expiresIn: tokenLife}
      );
      const refreshToken = sign({
        email: user.email,
        _id: user._id,
        profiles: user.profiles
      }, getSecretOrPrivateKey(), {expiresIn: refreshTokenLife})

      return new HttpResponseOK({accessToken: accessToken, refreshToken: refreshToken});
    }catch (e) {
      return new HttpResponseBadRequest('authentication invalid');
    }
  }

  @Post('/oauth/refreshToken')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      refreshToken: { type: 'string' }
    },
    type: 'object',

  })
  async getAcessToken(ctx: Context) {
    try {
      if(!ctx.request.body.refreshToken){
        return new HttpResponseUnauthorized();
      }
      const tokenLife = Config.get('settings.jwt.tokenLife');
      const refreshTokenLife = Config.get('settings.jwt.refreshTokenLife');

      const payload = await verify(ctx.request.body.refreshToken, getSecretOrPrivateKey());

      const user = await User.findOne(payload._id);
      console.log(user)
      if (user == undefined) {
        return new HttpResponseUnauthorized();
      }
      const token = sign(
          {email: user.email, _id: user._id, profiles: user.profiles},
          getSecretOrPrivateKey(),
          {expiresIn: tokenLife}
      );
      const refreshToken = sign( { email: user.email, _id: user._id, profiles: user.profiles }, getSecretOrPrivateKey(), { expiresIn: refreshTokenLife})
      return new HttpResponseOK({ accessToken: token , refreshToken: refreshToken});
    }catch(err){
      console.log(err);
      if(err.name == 'TokenExpiredError'){
        return new HttpResponseUnauthorized();
      }

      return new HttpResponseInternalServerError();
    }
  }




}
