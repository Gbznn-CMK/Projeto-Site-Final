import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:() =>
            import ('./Features/buscar/buscar') .then((m)=>m.Buscar)


    }
];
