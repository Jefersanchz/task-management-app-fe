import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/pages/auth-page/auth-page.component';  // Asegúrate de importar el componente correcto
import { BoardListComponent } from './features/boards/pages/board-list/board-list.component';  // Importa BoardListComponent
import { BoardDetailComponent } from './features/boards/pages/board-detail/board-detail.component';  // Importa BoardDetailComponent

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
    path: 'boards',  // Ruta para la lista de tableros
    component: BoardListComponent
  },
  {
    path: 'boards/:id',  // Ruta para ver el detalle de un tablero
    component: BoardDetailComponent
  },
  // Otras rutas que quieras agregar
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
