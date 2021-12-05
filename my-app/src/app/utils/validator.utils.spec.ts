import { strictEqual } from 'assert';
import {ValidatorUtils} from './validator.utils';

describe('ValidatorUtils', () => {

    describe('Validations Class', () => {

        it(' Cell validation OK (10 digits).', () => {
            strictEqual(ValidatorUtils.validarTelefone('(91) 3223-8999'), true);
        });

        it(' Cell validation OK (11 digits).', () => {
            strictEqual(ValidatorUtils.validarTelefone('(91) 93223-8999'), true);
        });


        it('validation Error.', () => {
            strictEqual(ValidatorUtils.validarTelefone('teste'), false);
        });

    });

});
