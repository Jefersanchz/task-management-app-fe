import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent {
  @Input() isModalOpen: boolean = false;
  @Input() columns: any[] = [];
  @Input() currentTask: any = { title: '', description: '', columnId: '' };
  @Input() isEditing: boolean = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<any>();
  @Output() taskUpdated = new EventEmitter<any>();

  onSubmit() {
    if (this.isEditing) {
      this.taskUpdated.emit(this.currentTask);
    } else {
      this.taskCreated.emit(this.currentTask);
    }
    this.resetForm();
    this.closeModal.emit();
  }

  resetForm() {
    this.currentTask = { title: '', description: '', columnId: '' };
  }
}
