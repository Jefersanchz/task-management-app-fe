import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BoardsService } from '../../services/boards.service';
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
  newBoard = { name: '', description: '', ownerId: 1 };

  constructor(
    private boardsService: BoardsService,
    private router: Router,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.boardsService.getBoards(this.newBoard.ownerId.toString()).subscribe((boards: any[]) => {
      this.boards = boards;
    });
  }

  openModal() {
    this.isModalOpen = true;
    console.log('Modal abierto:', this.isModalOpen); 
    this.cdr.detectChanges(); 
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onBoardCreated(board: any) {
    this.boardsService.createBoard(board.ownerId.toString(), board).subscribe((newBoard: any) => {
      this.boards.push(newBoard);
      this.closeModal();
    });
  }

  redirectToBoardDetail(boardId: string) {
    this.router.navigate([`/board/${boardId}`]);
  }

  exportBoardAsJson(board: any): void {
    const ownerId = board.ownerId.toString();
    this.boardsService.exportBoardAsJson(ownerId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${board.name}-tablero.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al exportar el tablero:', error);
        Swal.fire('Error', 'Hubo un problema al exportar el tablero.', 'error');
      }
    });
  }
  
  deleteBoard(boardId: string): void {
    const ownerId = '1';
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
        this.boardsService.deleteBoard(boardId, ownerId).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El tablero ha sido eliminado.', 'success');
            this.loadBoards();
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el tablero.', 'error');
            console.error('Error al eliminar el tablero:', error);
          }
        });
      } else {
        Swal.fire('Cancelado', 'La eliminación del tablero fue cancelada.', 'info');
      }
    });
  }
}
