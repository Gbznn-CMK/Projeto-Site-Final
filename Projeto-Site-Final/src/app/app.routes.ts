import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:() =>
            import ('./Features/buscar/buscar') .then((m)=>m.Buscar)
    },
     {
        path:'Buscar',
        loadComponent:() =>
            import ('./Features/buscar/buscar') .then((m)=>m.Buscar)
    },
    {
        path:'Perfil',
        loadComponent :() =>
        import ('./Features/perfil-user/perfil-user').then((m)=>m.PerfilUser)
    }
];
