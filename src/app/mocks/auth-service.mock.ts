// src/app/mocks/auth-service.mock.ts
import { of } from 'rxjs';

export class AuthServiceMock {
  login(username: string, password: string) {
    // Simula la respuesta de un login exitoso
    return of({});  // Esto es un Observable vacío, simulando una respuesta exitosa.
  }

  storeUserSession(response: any) {
    // Simula que el servicio almacena la sesión del usuario.
  }
  register(firstName: string, lastName: string, username: string, password: string) {
    // Simula una respuesta exitosa de un registro
    return of({ success: true });
  }
}
