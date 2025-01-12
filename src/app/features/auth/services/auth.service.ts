import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';  // Para manejar errores en la solicitud

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrlLogin = 'http://localhost:9000/api/users/login'; // URL del backend para login
  private apiUrlRegister = 'http://localhost:9000/api/users/register'; // URL del backend para registro

  constructor(private http: HttpClient) { }

  // Método para hacer login
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };  // Los datos a enviar en el body de la solicitud

    return this.http.post(this.apiUrlLogin, loginData)
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud de login', error);
          throw error;  // Vuelve a lanzar el error
        })
      );
  }

  // Método para hacer registro
  register(firstName: string, lastName: string, username: string, password: string): Observable<any> {
    const registerData = { firstName, lastName, username, password };  // Los datos a enviar en el body de la solicitud

    return this.http.post(this.apiUrlRegister, registerData)
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud de registro', error);
          throw error;  // Vuelve a lanzar el error
        })
      );
  }

  // Método para almacenar datos del usuario en localStorage
  storeUserSession(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));  // Almacenamos los datos del usuario como string
  }

  // Método para obtener los datos del usuario desde localStorage
  getUserSession(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;  // Retorna los datos si existen, si no, retorna null
  }

  // Método para limpiar la sesión del usuario
  clearUserSession(): void {
    localStorage.removeItem('user');  // Elimina los datos de la sesión del localStorage
  }

  // Método para verificar si hay una sesión activa
  isAuthenticated(): boolean {
    return this.getUserSession() !== null;  // Si hay datos en localStorage, significa que hay una sesión activa
  }
}
