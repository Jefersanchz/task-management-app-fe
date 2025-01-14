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
  tasks: Task[];  //  tasks array de tipo Task
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
connectedColumns: string[] = []; // Aquí guardaremos los valores de conexión de las columnas

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
  moveTaskModalVisible = false;
  taskToMove: Task | null = null;
  selectedColumnId: string = '';
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
  
  loadColumns(boardId: string): void {
    this.boardsService.getColumns(boardId).subscribe({
      next: (columns) => {
        console.log('Columnas cargadas:', columns);
        this.board.columns = columns;
        this.columns = [...columns];

        // Convertir los IDs de las columnas a cadenas para ser usados en connectedColumns
        this.connectedColumns = this.columns.map(c => c.id.toString());
        
        // Llamar a la función para verificar connectedColumns
        this.checkConnectedColumns();

        // Asegúrate de que los cambios en las columnas se detecten
        if (this.connectedColumns.length > 0) {
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar las columnas:', error);
      }
    });
  }

  // Función para verificar y mostrar el contenido de connectedColumns
  checkConnectedColumns(): void {
    console.log('Columnas conectadas en checkConnectedColumns:', this.connectedColumns);
  }
  onDropListEnter(event: any): void {
    console.log('cdkDropListConnectedTo está conectado a:', this.connectedColumns);
    console.log('Evento recibido en onDropListEnter:', event);
  }
  
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board']) {
    }
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
  promptMoveTask(column: Column, task: Task) {
    console.log('Iniciando mover tarea...');
    console.log('Columna actual:', column);
    console.log('Tarea a mover:', task);
  
    this.taskToMove = task;
    this.selectedColumnId = column.id; // Preselecciona la columna actual
    this.moveTaskModalVisible = true;
  
    console.log('Modal de mover tarea visible:', this.moveTaskModalVisible);
    console.log('Columna preseleccionada:', this.selectedColumnId);
  }

  cancelMoveTask() {
    this.moveTaskModalVisible = false;
    this.taskToMove = null;
    this.selectedColumnId = '';
  }
  confirmMoveTask() {
    console.log('Confirmando mover tarea...');
    console.log('Tarea a mover:', this.taskToMove);
    console.log('Columna destino seleccionada:', this.selectedColumnId);
  
    if (this.taskToMove && this.selectedColumnId) {
      const currentColumn = this.columns.find(col => col.tasks.includes(this.taskToMove));
      const targetColumn = this.columns.find(col => col.id === Number(this.selectedColumnId)); // Conversión a número
  
      console.log('Columna actual encontrada:', currentColumn);
      console.log('Columna destino encontrada:', targetColumn);
  
      if (currentColumn && targetColumn && currentColumn !== targetColumn) {
        console.log('Moviendo tarea...');
  
        // Llamada al servicio para actualizar la tarea en el backend
        this.boardsService.updateTask(this.taskToMove.id.toString(), {
          ...this.taskToMove,
          columnId: targetColumn.id // Actualiza el ID de la columna
        }).subscribe(
          (response) => {
            // Actualización exitosa en el backend
            console.log('Tarea actualizada en el backend:', response);
  
            // Actualización local
            currentColumn.tasks = currentColumn.tasks.filter((task: Task) => task !== this.taskToMove);
            targetColumn.tasks.push(response); // Usa la respuesta del backend para la tarea actualizada
  
            console.log(`Tarea movida a la columna: ${targetColumn.name}`);
  
            // Llamada al método loadColumns después de mover la tarea
            const boardId = this.route.snapshot.paramMap.get('id'); // Obtén el boardId de la URL
            if (boardId) {
              this.loadColumns(boardId); // Pasa el boardId a loadColumns
            }
  
          },
          (error) => {
            // Manejo de errores
            console.error('Error al mover la tarea en el backend:', error);
          }
        );
      } else {
        console.log('No se pudo mover la tarea. Verifica las columnas.');
      }
    } else {
      console.log('Datos insuficientes para mover la tarea.');
    }
  
    this.cancelMoveTask(); // Cierra el modal después de mover
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
  
        // Llamar a loadColumns después de crear la tarea
        const boardId = this.route.snapshot.paramMap.get('id'); // Obtén el boardId de la URL
        if (boardId) {
          this.loadColumns(boardId); // Pasa el boardId a loadColumns
        }
  
      },
      error: (err) => {
        Swal.fire('Error', 'Hubo un problema al crear la tarea.', 'error');
        console.error('Error al crear tarea:', err);
      }
    });
  }
  
onDrop(event: CdkDragDrop<any[]>, column: Column): void {
  const { previousIndex, currentIndex, previousContainer, container } = event;

  console.log('Índice anterior:', previousIndex);
  console.log('Índice actual:', currentIndex);
  console.log('Contenedor anterior:', previousContainer.id);
  console.log('Contenedor actual:', container.id);
  
  // Mostrar todos los contenedores registrados
  console.log('Contenedores conectados:', this.connectedColumns);
  console.log('Total de contenedores:', this.connectedColumns.length);
  
  if (previousContainer !== container) {
    console.log('Se está moviendo entre columnas');
    const movedTask = previousContainer.data.splice(previousIndex, 1)[0]; // Elimina la tarea de la columna anterior
    container.data.splice(currentIndex, 0, movedTask); // Inserta la tarea en la columna de destino

    console.log('Tarea movida a una nueva columna:', movedTask);
  } else if (previousIndex !== currentIndex) {
    console.log('Se está moviendo dentro de la misma columna');
    const movedTask = previousContainer.data.splice(previousIndex, 1)[0]; // Elimina la tarea
    container.data.splice(currentIndex, 0, movedTask); // Inserta la tarea en la nueva posición

    console.log('Tarea movida dentro de la misma columna:', movedTask);
  }

  this.cdr.detectChanges();
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
  
        // Crear la columna en el backend
        this.boardsService.createColumn(boardId, this.newColumn).subscribe((newColumn: Column) => {
          // Añadir la nueva columna a la lista de columnas localmente
          this.board.columns.push(newColumn);
          
          // Cerrar el modal de la nueva columna
          this.closeColumnModal();
  
          // Llamar a loadColumns para recargar las columnas, si es necesario
          this.loadColumns(boardId);
        }, (error) => {
          console.error('Error al crear la columna:', error);
          Swal.fire('Error', 'Hubo un problema al crear la columna.', 'error');
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
  
    // Filtrar tareas de la columna
    const filteredTasks = column.tasks.filter((task: Task) => {
      const matchesName = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesColumn = this.searchStatus ? String(task.columnId) === String(this.searchStatus) : true;
      return matchesName && matchesColumn;
    });
  
    return filteredTasks;
  }
  
  getFilteredColumns(): any[] {
    return this.board.columns.filter(column => {
      if (!column.tasks) return false;
  
      // Filtrar las tareas de cada columna
      const filteredTasks = column.tasks.filter((task: Task) => {
        const matchesName = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesColumn = this.searchStatus ? String(task.columnId) === String(this.searchStatus) : true;
        return matchesName && matchesColumn;
      });
  
      // Si quieres que la columna tenga solo las tareas filtradas:
      column.tasks = filteredTasks;
  
      // Solo mostrar la columna si tiene tareas que coinciden
      return filteredTasks.length > 0;
    });
  }
  
}
