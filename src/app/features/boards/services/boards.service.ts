// boards.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor() { }
  getBoardById(boardId: string): Observable<any> {
    // Aquí deberías hacer una llamada a una API o a un archivo JSON
    // Para simplificar, vamos a devolver un ejemplo estático
    const board = {
      id: boardId,
      name: 'Tablero de Ejemplo',
      columns: [
        { name: 'Por hacer', tasks: [{ title: 'Tarea 1', description: 'Descripción de la tarea' }] },
        { name: 'En progreso', tasks: [{ title: 'Tarea 2', description: 'Descripción de la tarea' }] },
        { name: 'Completado', tasks: [{ title: 'Tarea 3', description: 'Descripción de la tarea' }] }
      ]
    };
    return of(board);  // Simula la respuesta de un servidor
  }

  // Ejemplo de método que devuelve una lista de tableros
  getBoards(): Observable<any[]> {
    // Aquí deberías hacer una llamada a una API o a un archivo JSON
    // Para fines de demostración, devolvemos una lista estática de tableros
    const boards = [
      { id: 1, name: 'Tablero 1', description: 'Descripción del tablero 1' },
      { id: 2, name: 'Tablero 2', description: 'Descripción del tablero 2' },
      { id: 3, name: 'Tablero 3', description: 'Descripción del tablero 3' }
    ];
    return of(boards);  // Simula la respuesta de un servidor
  }
}
