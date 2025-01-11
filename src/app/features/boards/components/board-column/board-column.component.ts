// board-column.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent {
  @Input() column!: { name: string, tasks: { title: string, description: string }[] };  // Aquí se usa '!' para evitar el error
}
