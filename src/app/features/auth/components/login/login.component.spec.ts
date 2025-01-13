// src/app/login/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthServiceMock } from '../../../../mocks/auth-service.mock';  // Importa el mock
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock }  // Usamos el mock aquí
      ],
      schemas: [NO_ERRORS_SCHEMA],  // Para ignorar errores de componentes no relevantes
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;  // Inyectamos el mock
    fixture.detectChanges();
  });

  it('debería llamar al método login con los valores correctos', () => {
    const loginSpy = spyOn(authService, 'login').and.callThrough();  // Espiamos el método login

    component.username = 'testuser';
    component.password = 'testpass';

    component.onLogin();  // Llamamos al método onLogin que utiliza el método login

    expect(loginSpy).toHaveBeenCalledWith(component.username, component.password);  // Verificamos que login se haya llamado con los valores correctos
  });
});
