import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Importa los entornos

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  private apiUrl = environment.apiUrl; // La URL base de la API definida en los entornos

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

  // Método para crear una nueva columna
  createColumn(boardId: string, column: { name: string; position: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/columns/create/${boardId}`, column);
  }

  // Método para obtener columnas de un tablero
  getColumns(boardId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/columns/${boardId}`);
  }

  // Método para eliminar un tablero
  deleteBoard(boardId: string, ownerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/boards/delete/${boardId}/${ownerId}`);
  }

  // Método para crear una nueva tarea
  createTask(columnId: string, taskData: { title: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/tasks/create/${columnId}`, taskData);
  }

  // Método para obtener todas las tareas
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/tasks/all`);
  }

  // Método para actualizar una tarea
  updateTask(taskId: string, taskData: { title: string, description: string, columnId: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/tasks/update/${taskId}`, taskData);
  }

  // Método para eliminar una tarea
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/tasks/delete/${taskId}`);
  }

  // Método para exportar un tablero como JSON
  exportBoardAsJson(ownerId: string): Observable<Blob> {
    const url = `${this.apiUrl}/api/boards/export/${ownerId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
