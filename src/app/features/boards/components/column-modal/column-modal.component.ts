import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-column-modal',
  templateUrl: './column-modal.component.html',
  styleUrls: ['./column-modal.component.css']
})
export class ColumnModalComponent {
  newColumn = { name: '' };
  @Output() columnCreated = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  addColumn() {
    if (this.newColumn.name) {
      this.columnCreated.emit(this.newColumn.name);
      this.newColumn.name = '';
    }
  }

  closeColumnModal() {
    this.closeModal.emit();
  }
}
