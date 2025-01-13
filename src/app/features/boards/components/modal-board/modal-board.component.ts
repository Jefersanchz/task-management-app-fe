import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-board',
  templateUrl: './modal-board.component.html',
  styleUrls: ['./modal-board.component.css']
})
export class ModalBoardComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Output() boardCreated = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  newBoard = { name: '', description: '', ownerId: 1 };

  ngOnInit() {
    console.log('isModalOpen:', this.isModalOpen);  
  }

  closeModal() {
    console.log('Cerrando modal...');
    this.modalClosed.emit();
  }

  onSubmit() {
    console.log('Formulario enviado:', this.newBoard);  
    if (this.newBoard.name && this.newBoard.description) {
      this.boardCreated.emit(this.newBoard);
      this.newBoard = { name: '', description: '', ownerId: 1 };  
      this.closeModal();
    }
  }
}
