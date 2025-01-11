// board-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../../services/boards.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  boards: any[] = [];  // Declaramos la propiedad 'boards' como un arreglo vacío

  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    // Llamamos al servicio para obtener los tableros
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;  // Asignamos los tableros a la propiedad 'boards'
    });
  }
}
