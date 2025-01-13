import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Para manejar errores en la solicitud
import { environment } from '../../../../environments/environment'; // Importa los entornos

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Base URL desde el entorno
  private apiUrlLogin = `${this.apiUrl}/api/users/login`; // Endpoint para login
  private apiUrlRegister = `${this.apiUrl}/api/users/register`; // Endpoint para registro

  constructor(private http: HttpClient) {}

  // Método para hacer login
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password }; // Datos del body

    return this.http.post(this.apiUrlLogin, loginData).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de login', error);
        throw error; // Vuelve a lanzar el error
      })
    );
  }

  // Método para hacer registro
  register(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): Observable<any> {
    const registerData = { firstName, lastName, username, password }; // Datos del body

    return this.http.post(this.apiUrlRegister, registerData).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de registro', error);
        throw error; // Vuelve a lanzar el error
      })
    );
  }

  // Métodos para la gestión de la sesión del usuario
  storeUserSession(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUserSession(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearUserSession(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.getUserSession() !== null;
  }
}
