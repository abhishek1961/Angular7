
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {DashboardComponent} from './components/dashboard/dashboard.component'
import {RegisterComponent} from './components/register/register.component'
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [{path:'home',component: HomeComponent},
{path:'dashboard',component: DashboardComponent},
{path:'register',component: RegisterComponent},
{path:'login',component:LoginComponent},
{path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
{path:'blog',component:BlogComponent,canActivate:[AuthGuard]},
{path:'edit-blog/:id',component:EditBlogComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


  export class AppRoutingModule { }
  