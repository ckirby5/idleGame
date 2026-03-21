import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MiningDashboard } from './components/mining-dashboard/mining-dashboard';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: Login, title: 'Login'},
    {path: 'register', component: Register, title: 'Register'},
    {path: 'dashboard', component: MiningDashboard, canActivate: [authGuard], title: 'Mining Dashboard'},
];
