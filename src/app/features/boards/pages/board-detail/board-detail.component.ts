import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsService } from '../../services/boards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface Task {
  title: string;
  description: string;
}

interface Column {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  board: { name: string, columns: Column[] } = { name: '', columns: [] };
  isModalOpen = false;
  newTask: Task = { title: '', description: '' };

  constructor(
    private route: ActivatedRoute, 
    private boardsService: BoardsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');

    if (boardId) {
      this.boardsService.getBoardById(boardId).subscribe(board => {
        this.board = board;
      });
    } else {
      this.router.navigate(['/boards']);
    }
  }

  openAddTaskForm() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addTask() {
    if (this.newTask.title && this.newTask.description) {
      const column = this.board.columns[0];
      column.tasks.push(this.newTask);

      this.closeModal();
      this.newTask = { title: '', description: '' };
    }
  }

  deleteTask(column: Column, task: Task) {
    const taskIndex = column.tasks.indexOf(task);
    if (taskIndex > -1) {
      column.tasks.splice(taskIndex, 1);
    }
  }

  moveTask(fromColumn: Column, toColumn: Column, task: Task) {
    // Mueve la tarea de una columna a otra
    const taskIndex = fromColumn.tasks.indexOf(task);
    if (taskIndex > -1) {
      fromColumn.tasks.splice(taskIndex, 1);
    }

    toColumn.tasks.push(task); // Agrega la tarea a la columna de destino
  }

  // Función para manejar el cambio de columna sin evento
  drop(fromColumn: Column, toColumn: Column, task: Task) {
    this.moveTask(fromColumn, toColumn, task); // Llama a la función de mover la tarea
  }
}
