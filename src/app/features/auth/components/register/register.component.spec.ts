// src/app/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { AuthServiceMock } from '../../../../mocks/auth-service.mock';  // Importa el mock
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { throwError } from 'rxjs';

import Swal from 'sweetalert2';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock }  // Usamos el mock para el AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA],  // Ignora los errores por dependencias externas como los formularios
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;  // Inyectamos el mock de AuthService
    fixture.detectChanges();
  });

  it('debería llamar al método register con los valores correctos', () => {
    const registerSpy = spyOn(authService, 'register').and.callThrough();  // Espiamos el método register

    // Asignamos valores al formulario
    component.firstName = 'Juan';
    component.lastName = 'Pérez';
    component.username = 'juanperez@example.com';
    component.password = 'password123';

    // Llamamos al método de registro
    component.register();

    // Verificamos que se haya llamado al método register con los valores correctos
    expect(registerSpy).toHaveBeenCalledWith(
      component.firstName,
      component.lastName,
      component.username,
      component.password
    );
  });

  it('debería mostrar una alerta de éxito cuando el registro es exitoso', () => {
    const swalSpy = spyOn(Swal, 'fire');  // Espiamos el método Swal.fire
    component.firstName = 'Juan';
    component.lastName = 'Pérez';
    component.username = 'juanperez@example.com';
    component.password = 'password123';
  
    // Simulamos la llamada al método register
    component.register();
  
    // Verificamos que se haya mostrado una alerta de éxito
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Registro Exitoso!',
        text: 'Bienvenido, ya puedes iniciar sesión.'
      })
    );
  });
  

  it('debería mostrar una alerta de error cuando el registro falla', () => {
    const swalSpy = spyOn(Swal, 'fire');  // Espiamos el método Swal.fire
  
    // Simulamos un error en el registro
    spyOn(authService, 'register').and.returnValue(throwError(() => new Error('Error de registro')));
  
    component.firstName = 'Juan';
    component.lastName = 'Pérez';
    component.username = 'juanperez@example.com';
    component.password = 'password123';
  
    // Llamamos al método de registro
    component.register();
  
    // Verificamos que se haya mostrado una alerta de error
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Error!',
        text: 'Hubo un problema con el registro. Inténtalo de nuevo.'
      })
    );
  });
  
});
