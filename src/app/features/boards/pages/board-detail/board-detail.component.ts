import { Component, OnInit ,OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsService } from '../../services/boards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

interface Task {
  id: number;
  title: string;
  description: string;
  columnId: string;
}


interface Column {
  id: string;
  name: string;
  tasks: Task[];  // Asegúrate de que tasks sea un array de tipo Task
}

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit, OnChanges {
  isEditing = false; 
editedTask: any = {};
selectedColumn: any = {}; 
searchQuery: string = '';
searchStatus: string = '';

  board: { name: string, columns: Column[] } = { name: '', columns: [] };
  isModalOpen = false;
  columns: any[] = [];
  allTasks: any[] = []; 
  currentTask: any = {};
  newTask: { title: string; description: string; columnId: string | null } = {
    title: '',
    description: '',
    columnId: null,
  };
    isColumnModalOpen = false;
  newColumn: { name: string; position: number } = { name: '', position: 0 }; 
  taskTitle: string = '';
  taskDescription: string = '';
  constructor(
    private route: ActivatedRoute, 
    private boardsService: BoardsService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}
  

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');

    if (boardId) {
      this.boardsService.getBoardById(boardId).subscribe({
        next: (board) => {
          this.board = board;
          this.loadColumns(boardId);
        },
        error: (error) => {
          console.error('Error al obtener el tablero:', error);
        }
      });
    } else {
      this.router.navigate(['/boards']);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board']) {
    }
  }
  loadColumns(boardId: string): void {
    this.boardsService.getColumns(boardId).subscribe({
      next: (columns) => {
        this.board.columns = columns.map((column) => ({
          ...column,
          tasks: [] 
        }));
        this.columns = [...columns];
        this.loadAllTasks();
      },
      error: (error) => {
        console.error('Error al cargar las columnas:', error);
      }
    });
  }
  
  loadAllTasks(): void {
    this.boardsService.getAllTasks().subscribe({
      next: (tasks) => {
        this.board.columns.forEach((column) => {
          column.tasks = tasks.filter((task) => task.columnId === column.id);
        });
  
        this.allTasks = tasks;  
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    });
  }
  editTask(column: any, task: Task): void {
    this.isModalOpen = true; 
    this.isEditing = true; 
    this.editedTask = { ...task }; 
    this.selectedColumn = column; 
    this.currentTask = this.editedTask; 
  }
  deleteTask(task: any): void {
    if (task && task.id) {
      const taskId = task.id;
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta tarea se eliminará permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.boardsService.deleteTask(taskId).subscribe(response => {
            const column = this.board.columns.find(col => col.tasks.some(t => t.id === taskId));
            if (column) {
              column.tasks = column.tasks.filter(t => t.id !== taskId);
            }
            Swal.fire(
              'Eliminado!',
              'La tarea ha sido eliminada.',
              'success'
            );
          }, error => {
            console.error('Error al eliminar la tarea:', error);
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar la tarea.',
              'error'
            );
          });
        } else {
          console.log('Eliminación cancelada');
        }
      });
    }
  }
    openAddTaskModal(): void {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentTask = { title: '', description: '', columnId: '' };
  }

  openEditTaskModal(task: any): void {
    this.isModalOpen = true;
    this.isEditing = true;
    this.currentTask = { ...task };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

createTask(task: Task): void {
  if (!task.title || !task.description || !task.columnId) {
    Swal.fire('Error', 'Por favor, ingresa un título, una descripción y selecciona una columna para la tarea.', 'error');
    return;
  }

  const taskData = { 
    title: task.title, 
    description: task.description 
  };

  this.boardsService.createTask(task.columnId, taskData).subscribe({
    next: (newTask) => {
      Swal.fire('Tarea Creada', 'La tarea se ha creado con éxito.', 'success');
      this.loadAllTasks();  // Recarga las tareas
    },
    error: (err) => {
      Swal.fire('Error', 'Hubo un problema al crear la tarea.', 'error');
      console.error('Error al crear tarea:', err);
    }
  });
}



  drop(fromColumn: Column, toColumn: Column | null, task: Task): void {
 
  
    if (toColumn && fromColumn.id !== toColumn.id) {
      this.moveTask(fromColumn, toColumn, task);
      this.cdr.detectChanges(); 
    } else {
    }
  }
  
  onDrop(event: CdkDragDrop<any[]>, targetColumn: Column): void {
    const task = event.item.data;
    const sourceColumn = this.columns.find(col => col.tasks.includes(task)); 

    if (sourceColumn && targetColumn && sourceColumn.id !== targetColumn.id) {
      const nextColumn = this.getNextColumn(targetColumn);
      if (nextColumn) {
        this.moveTask(sourceColumn, nextColumn, task);
      } else {
        console.log("No hay columna siguiente para mover la tarea.");
      }
    } else {
      console.log("Las columnas no son válidas o son iguales.");
    }
  }
  updateLocalTask(updatedTask: Task): void {

    const column = this.board.columns.find(col => col.id === updatedTask.columnId);
  
    if (column) {
      const taskIndex = column.tasks.findIndex(task => task.id === updatedTask.id);
  
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = updatedTask;
  
        this.board.columns = [...this.board.columns];
      } else {
        console.error('Tarea no encontrada en la columna.');
      }
    } else {
      console.error('Columna no encontrada.');
    }
  }
  
  
  moveTask(fromColumn: Column, toColumn: Column, task: Task): void {
    if (!toColumn.tasks) {
      console.error('La columna destino no tiene tareas inicializadas:', toColumn);
      toColumn.tasks = []; 
    }
    const taskIndex = fromColumn.tasks.indexOf(task);
    if (taskIndex > -1) {
      fromColumn.tasks.splice(taskIndex, 1);
    }

    task.columnId = toColumn.id.toString();  
    const movedTask = { ...task };  
    toColumn.tasks.push(movedTask);
    this.board.columns = [...this.board.columns];
    this.updateTask(movedTask);
    this.cdr.detectChanges();
  }

  updateTask(task: Task): void {
    if (task && task.id) {
      const updatedTask = { 
        ...task, 
        columnId: Number(task.columnId) 
      };
        this.boardsService.updateTask(task.id.toString(), updatedTask).subscribe({
        next: (response) => {
          console.log('Tarea actualizada:', response);
    this.loadAllTasks();
          this.isModalOpen = false;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error al actualizar la tarea:', error);
        }
      });
    }
  }
  getNextColumn(currentColumn: Column): Column | null {
    const currentIndex = this.columns.findIndex((col) => col.id === currentColumn.id);
    const nextColumn = this.columns[currentIndex + 1] || null;
    return nextColumn;
  }

  openAddColumnForm() {
    this.isColumnModalOpen = true;
  }

  closeColumnModal() {
    this.isColumnModalOpen = false;
    this.newColumn = { name: '', position: 0 }; 
  }
 
  addColumn() {
    if (this.newColumn.name) {
      const boardId = this.route.snapshot.paramMap.get('id');
      if (boardId) {
        if (!this.board.columns) {
          this.board.columns = [];
        }
          this.newColumn.position = this.board.columns.length;
  
        this.boardsService.createColumn(boardId, this.newColumn).subscribe((newColumn: Column) => {
          this.board.columns.push(newColumn); 
          this.closeColumnModal(); 
        });
      }
    }
  }
  handleColumnCreated(columnName: string) {
    this.newColumn.name = columnName; 
    this.addColumn();
  }
  
  getFilteredTasks(column: any): Task[] {
 
    if (!column.tasks) {
      return []; 
    }
    const filteredTasks = column.tasks.filter((task: Task) => {
      const matchesName = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesColumn = this.searchStatus ? String(task.columnId) === String(this.searchStatus) : true;
      return matchesName && matchesColumn;
    });
    return filteredTasks; 
  }
}
