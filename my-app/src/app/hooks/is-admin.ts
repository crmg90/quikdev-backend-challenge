import {
    Hook,
    HookDecorator,
    HttpResponse,
    HttpResponseUnauthorized,
} from '@foal/core';

export function IsAdmin(): HookDecorator {
    return Hook(async ctx => {
        if (!ctx.user || ctx.user.profiles == null || ctx.user.profiles.length == 0) {
            return new HttpResponseUnauthorized();
        }

        if(ctx.user.profiles.filter(p => p.name == 'ADMIN').length ==  0){
            // console.log('não admin', ctx.user.id)
            return new HttpResponseUnauthorized();
        }else {
            // console.log('admin', ctx.user.id)
        }

        return (response: HttpResponse) => {};

    });
}
