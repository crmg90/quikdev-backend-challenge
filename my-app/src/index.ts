import 'source-map-support/register';

// std
import * as http from 'http';

// 3p
import {Config, createApp, displayServerURL, getAjvInstance} from '@foal/core';

// App
import { AppController } from './app/app.controller';
import {InitialConfig} from './initialConfig';
import {ValidatorUtils} from './app/utils/validator.utils';

async function main() {

  const Ajv = getAjvInstance();
  Ajv.addKeyword('validateCell', {
    modifying: false,
    schema: true, // keyword value is not used, can be true
    validate: function(data, dataPath, parentData, parentDataProperty){
      if(!dataPath){
        return true;
      }
      return ValidatorUtils.validarTelefone(dataPath)
    }
  })
  Ajv.addFormat('date', /^(\d{4}[-]\d{2}[-]\d{2})?$/)
  require('ajv-errors')(Ajv /*, {singleError: true} */);

  const app = await createApp(AppController);
  await InitialConfig.main();

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); });
