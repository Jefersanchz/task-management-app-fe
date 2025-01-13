import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-board',
  templateUrl: './modal-board.component.html',
  styleUrls: ['./modal-board.component.css']
})
export class ModalBoardComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Input() ownerId!: number; // Recibimos el ownerId dinámicamente desde el componente padre
  @Output() boardCreated = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  newBoard = { name: '', description: '', ownerId: 0 };

  ngOnInit() {
    console.log('isModalOpen:', this.isModalOpen);
    console.log('Owner ID recibido:', this.ownerId);

    // Inicializa el ownerId en newBoard cuando el componente se inicializa
    this.newBoard.ownerId = this.ownerId;
  }

  closeModal() {
    console.log('Cerrando modal...');
    this.modalClosed.emit();
  }

  onSubmit() {
    console.log('Formulario enviado:', this.newBoard);
    if (this.newBoard.name && this.newBoard.description) {
      // Emitir el nuevo tablero
      this.boardCreated.emit(this.newBoard);

      // Resetear el formulario y mantener el ownerId dinámico
      this.newBoard = { name: '', description: '', ownerId: this.ownerId };
      this.closeModal();
    }
  }
}
