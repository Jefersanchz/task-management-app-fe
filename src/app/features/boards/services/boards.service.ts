import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  private apiUrl = 'http://localhost:9000';  // La URL base de la API en tu entorno local

  constructor(private http: HttpClient) { }

  // Método para obtener un tablero por su ID
  getBoardById(boardId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/boards/${boardId}`);
  }

  // Método para obtener todos los tableros de un propietario
  getBoards(ownerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/boards/${ownerId}`);
  }

  // Método para crear un nuevo tablero
  createBoard(ownerId: string, boardData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/boards/create/${ownerId}`, boardData);
  }
  createColumn(boardId: string, column: { name: string; position: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/columns/create/${boardId}`, column);
  }
  getColumns(boardId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/columns/${boardId}`);
  }
  deleteBoard(boardId: string, ownerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/boards/delete/${boardId}/${ownerId}`);
  }
  createTask(columnId: string, taskData: { title: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/tasks/create/${columnId}`, taskData);
  }
  
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/tasks/all`);
  }
  updateTask(taskId: string, taskData: { title: string, description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/tasks/update/${taskId}`, taskData);
  }

  // Eliminar tarea
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/tasks/delete/${taskId}`);
  }
}
