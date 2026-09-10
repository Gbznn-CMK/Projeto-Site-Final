import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:() =>
            import ('./Features/buscar/buscar') .then((m)=>m.Buscar)
    },
     {
        path:'buscar',
        loadComponent:() =>
            import ('./Features/buscar/buscar').then((m)=>m.Buscar)
    },
    {
        path:'perfil',
        loadComponent :() =>
        import ('./Features/perfil-user/perfil-user').then((m)=>m.perfilUser)
    }
];

