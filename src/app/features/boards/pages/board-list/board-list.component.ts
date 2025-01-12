// board-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../../services/boards.service';  // Asegúrate de importar el servicio
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  boards: any[] = [];
  isModalOpen: boolean = false;
  newBoard = { name: '', description: '', ownerId: 1 }; // Puedes adaptar `ownerId` según sea necesario

  constructor(private boardsService: BoardsService, private router: Router) {}
  
  ngOnInit(): void {
    // Pasar ownerId al llamar al servicio
    this.loadBoards();  // Llamamos al método loadBoards para cargar los tableros al iniciar
  }
  
  loadBoards(): void {
    this.boardsService.getBoards(this.newBoard.ownerId.toString()).subscribe((boards: any[]) => {
      this.boards = boards;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.newBoard.name && this.newBoard.description) {
      this.boardsService.createBoard(this.newBoard.ownerId.toString(), this.newBoard).subscribe((newBoard: any) => {
        // Agregar el nuevo tablero a la lista
        this.boards.push(newBoard);
  
        // Limpiar el formulario
        this.newBoard = { name: '', description: '', ownerId: 1 }; // Restablecer los campos del formulario
  
        // Cerrar el modal
        this.closeModal();
      });
    }
  }

  redirectToBoardDetail(boardId: string) {
    this.router.navigate([`/board/${boardId}`]);
  }

  deleteBoard(boardId: string): void {
    const ownerId = '1'; // Aquí debes tomar el ID del propietario, puedes obtenerlo de tu aplicación
  
    // Muestra la alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este tablero será eliminado permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realiza la eliminación
        this.boardsService.deleteBoard(boardId, ownerId).subscribe({
          next: () => {
            // Muestra un mensaje de éxito
            Swal.fire('Eliminado!', 'El tablero ha sido eliminado.', 'success');
            
            // Aquí se vuelve a cargar la lista de tableros después de la eliminación
            this.loadBoards();  // Actualizamos la lista de tableros
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el tablero.', 'error');
            console.error('Error al eliminar el tablero:', error);
          }
        });
      } else {
        // Si el usuario cancela, muestra un mensaje de cancelación
        Swal.fire('Cancelado', 'La eliminación del tablero fue cancelada.', 'info');
      }
    });
  }
}
