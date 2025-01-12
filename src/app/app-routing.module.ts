import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/pages/auth-page/auth-page.component';  // Asegúrate de importar el componente correcto
import { BoardListComponent } from './features/boards/pages/board-list/board-list.component';  // Importa BoardListComponent
import { BoardDetailComponent } from './features/boards/pages/board-detail/board-detail.component';  // Importa BoardDetailComponent
import { AuthGuard } from './guards/auth.guard'; // Importa AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',  // Redirige a la ruta de auth al cargar la aplicación
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthPageComponent  // El componente correcto para la página de autenticación
  },
  {
    path: 'boards',
    component: BoardListComponent,
    canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'boards/:id',
    component: BoardDetailComponent,
    canActivate: [AuthGuard] // Protege esta ruta
  },
  // Otras rutas que quieras agregar
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
