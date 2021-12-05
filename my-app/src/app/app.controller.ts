import { controller, IAppController } from '@foal/core';
import { createConnection } from 'typeorm';

import {AdminController, ApiController, InviteController, UserController} from './controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/api/v1/user', UserController),
    controller('/api/v1/invitation', InviteController),
    controller('/api/v1/admin', AdminController),
  ];

  async init() {
    await createConnection();
  }
}
