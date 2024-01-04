import { Routes } from '@angular/router';
import { MonitoresComponent } from './monitores/monitores.component';
import { PageBodyComponent } from './page-body/page-body.component';

export const routes: Routes = [
    { path: 'monitores', component: MonitoresComponent },
    {path: 'page-body', component: PageBodyComponent},
    { path: '', redirectTo: '/page-body', pathMatch: 'full' }
];
