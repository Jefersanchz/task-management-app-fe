import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardListComponent } from './pages/board-list/board-list.component';
import { BoardDetailComponent } from './pages/board-detail/board-detail.component';

const routes: Routes = [
  { path: '', component: BoardListComponent },
  { path: 'board/:id', component: BoardDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
