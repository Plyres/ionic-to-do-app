import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TodoTaskComponent } from './todo-task/components/todo-task.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'todo-list',
    loadChildren: () => import('./todo/todo-list/todo-list.module').then( m => m.TodoListPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'todo-task/:id',
    component: TodoTaskComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  }
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
