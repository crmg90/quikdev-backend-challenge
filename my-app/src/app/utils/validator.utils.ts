export class ValidatorUtils{
    static validarTelefone(telefone: string): boolean{
        if(telefone == null){
            return true;
        }
        const regex = /^\(\d{2}\)\s\d{4,5}[-]\d{4}$/;
        if(!regex.test(telefone)){
            return false;
        }
        return true;
    }
}
