import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListComponent } from './pages/board-list/board-list.component';
import { BoardDetailComponent } from './pages/board-detail/board-detail.component';
import { BoardColumnComponent } from './components/board-column/board-column.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { BoardsRoutingModule } from './boards-routing.module';
import { DragDropDirective } from './components/drag-drop.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    BoardListComponent,
    BoardDetailComponent,
    BoardColumnComponent,
    TaskCardComponent,
    DragDropDirective,
    NavbarComponent,
  ],
  imports: [CommonModule, BoardsRoutingModule,FormsModule,DragDropModule,
  ],
})
export class BoardsModule {}
