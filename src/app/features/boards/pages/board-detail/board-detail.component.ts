import { Component, OnInit } from '@angular/core';
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
export class BoardDetailComponent implements OnInit {
  isEditing = false; // Indica si estamos editando una tarea
editedTask: any = {}; // Contiene la tarea que se está editando
selectedColumn: any = {}; // Columna de la tarea seleccionada

  board: { name: string, columns: Column[] } = { name: '', columns: [] };
  isModalOpen = false;
  columns: any[] = [];      // Array para almacenar las columnas
  allTasks: any[] = []; // Array para almacenar todas las tareas
  currentTask: any = {};
  newTask: { title: string; description: string; columnId: string | null } = {
    title: '',
    description: '',
    columnId: null,
  };
    isColumnModalOpen = false;
  newColumn: { name: string; position: number } = { name: '', position: 0 }; // Nueva columna con posición
  taskTitle: string = '';
  taskDescription: string = '';
  constructor(
    private route: ActivatedRoute, 
    private boardsService: BoardsService,
    private router: Router,
    private cdr: ChangeDetectorRef  // Corregir aquí el nombre
  ) {}
  

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
  
    if (boardId) {
      this.boardsService.getBoardById(boardId).subscribe({
        next: (board) => {
          this.board = board; // Asigna el tablero completo
          this.loadColumns(boardId); // Llama a la función para cargar las columnas
          this.loadAllTasks(); // Llama a la función para cargar todas las tareas
        },
        error: (error) => {
          console.error('Error al obtener el tablero:', error);
        }
      });
    } else {
      this.router.navigate(['/boards']); // Navega de regreso si no hay boardId
    }
  }
  

  loadColumns(boardId: string): void {
    this.boardsService.getColumns(boardId).subscribe({
      next: (columns) => {
        this.board.columns = columns; // Mantén las columnas en el board
        this.columns = [...columns];  // Asigna las columnas a `this.columns` para el select
      },
      error: (error) => {
        console.error('Error al cargar las columnas:', error);
      }
    });
  }
  loadAllTasks(): void {
    this.boardsService.getAllTasks().subscribe({
      next: (tasks) => {
        console.log('Tareas cargadas:', tasks);
  
        // Agrupa las tareas por columnId en las columnas
        this.board.columns.forEach((column) => {
          column.tasks = tasks.filter((task) => task.columnId === column.id);
        });
  
        this.allTasks = tasks;  // Asigna las tareas al array `allTasks` si es necesario
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    });
  }
  
  
// Función para actualizar la tarea en el estado local
updateLocalTask(updatedTask: Task): void {
  const column = this.board.columns.find(col => col.id === updatedTask.columnId);
  if (column) {
    const taskIndex = column.tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      // Actualiza la tarea en el array de tareas de la columna
      column.tasks[taskIndex] = updatedTask;
    }
  }
}

  editTask(column: any, task: Task): void {
    this.isModalOpen = true; // Abre la modal
    this.isEditing = true; // Indica que estamos editando
    this.editedTask = { ...task }; // Clona la tarea seleccionada
    this.selectedColumn = column; // Guarda la columna actual
    this.currentTask = this.editedTask; // Establece la tarea actual
  }
  
  updateTask(): void {
    if (this.editedTask && this.editedTask.id) {
      const taskId = this.editedTask.id;
      const taskData = {
        id: taskId,  // Agregar el id
        title: this.editedTask.title,
        description: this.editedTask.description,
        columnId: this.editedTask.columnId  // Agregar el columnId
      };
  
      this.boardsService.updateTask(taskId, taskData).subscribe(response => {
        console.log('Tarea actualizada:', response);
        this.updateLocalTask(this.editedTask); // Actualiza la tarea localmente
  
        this.isModalOpen = false; // Cierra la modal
        this.isEditing = false; // Desactiva el modo de edición
      }, error => {
        console.error('Error al actualizar la tarea:', error);
      });
    }
  }
  


  // Función para eliminar la tarea
  deleteTask(task: any): void {
    if (task && task.id) {
      const taskId = task.id;
  
      // Mostrar la alerta de confirmación
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
          // Si el usuario confirma, realiza la eliminación
          this.boardsService.deleteTask(taskId).subscribe(response => {
            console.log('Tarea eliminada:', response);
  
            // Actualizar la UI eliminando la tarea de la columna en tiempo real
            const column = this.board.columns.find(col => col.tasks.some(t => t.id === taskId));
            if (column) {
              // Filtrar las tareas y eliminar la tarea que se eliminó
              column.tasks = column.tasks.filter(t => t.id !== taskId);
            }
  
            // Mostrar la alerta de éxito
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
          // Si el usuario cancela, no hace nada
          console.log('Eliminación cancelada');
        }
      });
    }
  }
  
  // Método para agregar una nueva tarea
  openAddTaskModal(): void {
    this.isModalOpen = true;
    this.isEditing = false; // Indica que estamos agregando
    this.newTask = { title: '', description: '', columnId: null }; // Reinicia los datos
    this.currentTask = this.newTask; // Establece la tarea actual
  }
  closeModal() {
    this.isModalOpen = false;
  }
  createTask(): void {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.columnId) {
      Swal.fire('Error', 'Por favor, ingresa un título, una descripción y selecciona una columna para la tarea.', 'error');
      return;
    }
  
    const taskData = { 
      title: this.newTask.title, 
      description: this.newTask.description 
    };
  
    // Asegúrate de pasar tanto `columnId` como `taskData` al servicio
    this.boardsService.createTask(this.newTask.columnId, taskData).subscribe({
      next: (task) => {
        Swal.fire('Tarea Creada', 'La tarea se ha creado con éxito.', 'success');
        
        // Limpiar los campos del formulario
        this.newTask.title = '';  
        this.newTask.description = '';  
        this.newTask.columnId = '';  
  
        // Cerrar la modal
        this.isModalOpen = false;
  
        // Recargar todas las tareas (esto actualizará la lista de tareas en la UI)
        this.loadAllTasks();  // Llamamos a loadAllTasks() para refrescar la lista de tareas en la UI
      },
      error: (err) => {
        Swal.fire('Error', 'Hubo un problema al crear la tarea.', 'error');
        console.error('Error al crear tarea:', err);
      }
    });
  }
  
  
  
 
  drop(fromColumn: Column, toColumn: Column | null, task: Task): void {
    // Imprime la tarea que se está moviendo y las columnas de origen y destino
    console.log('Tarea a mover:', task);
    console.log('Columna de origen:', fromColumn);
    console.log('Columna de destino:', toColumn);
  
    // Verifica si las columnas son diferentes y si la columna destino es válida
    if (toColumn && fromColumn.id !== toColumn.id) {
      console.log('Moviendo tarea de la columna:', fromColumn.name, 'a la columna:', toColumn.name);
      this.moveTask(fromColumn, toColumn, task); // Llama a la función para mover la tarea
      this.cdr.detectChanges(); // Fuerza la actualización de la interfaz
    } else {
      console.log('No es necesario mover la tarea, las columnas son iguales o la columna destino es nula');
    }
  }
  
  // Función para mover la tarea de una columna a otra
  onDrop(event: CdkDragDrop<any[]>, targetColumn: any): void {
    const task = event.item.data;  // Obtener la tarea desde el evento
    const sourceColumn = this.board.columns.find(col => col.tasks.includes(task)); // Encuentra la columna de origen
  
    // Verificar si sourceColumn y targetColumn son válidas
    if (sourceColumn && targetColumn && sourceColumn.id !== targetColumn.id) {
      // Mueve la tarea de la columna de origen a la de destino
      this.moveTask(sourceColumn, targetColumn, task);
    } else {
      console.log("Las columnas no son válidas o son iguales.");
    }
  }
  
  // Función para mover la tarea entre columnas
  moveTask(fromColumn: Column, toColumn: Column, task: Task): void {
    // Elimina la tarea de la columna de origen
    const taskIndex = fromColumn.tasks.indexOf(task);
    if (taskIndex > -1) {
      fromColumn.tasks.splice(taskIndex, 1);
    }
  
    // Agrega la tarea a la nueva columna
    task.columnId = toColumn.id; // Actualiza el ID de la columna en la tarea
    toColumn.tasks.push(task);
  }

  // Función para obtener la siguiente columna
  getNextColumn(currentColumn: Column): Column | null {
    // Encuentra el índice de la columna actual
    const currentIndex = this.columns.findIndex((col) => col.id === currentColumn.id);
    // Devuelve la siguiente columna o null si no hay una siguiente
    const nextColumn = this.columns[currentIndex + 1] || null;
    console.log('La siguiente columna para', currentColumn.name, 'es', nextColumn ? nextColumn.name : 'ninguna');
    return nextColumn; // Devuelve null si no hay una siguiente
  }
  
  
  
  openAddColumnForm() {
    this.isColumnModalOpen = true;
  }

  closeColumnModal() {
    this.isColumnModalOpen = false;
    this.newColumn = { name: '', position: 0 }; // Reseteamos el formulario
  }
  addColumn() {
    if (this.newColumn.name) {
      const boardId = this.route.snapshot.paramMap.get('id');
      if (boardId) {
        // Asegúrate de que `columns` esté definido
        if (!this.board.columns) {
          this.board.columns = [];
        }
  
        // Calcula la posición de la nueva columna
        this.newColumn.position = this.board.columns.length;
  
        this.boardsService.createColumn(boardId, this.newColumn).subscribe((newColumn: Column) => {
          this.board.columns.push(newColumn); // Agrega la nueva columna
          this.closeColumnModal(); // Cierra el modal
        });
      }
    }
  }
  
}
