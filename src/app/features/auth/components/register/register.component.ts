import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() switchToLogin = new EventEmitter<void>();  // Creamos un EventEmitter para cambiar a la vista de login
  firstName: string = '';
  lastName: string = '';
  username: string = '';  // Correo electrónico
  password: string = '';

  // Método para manejar el envío del formulario de registro
  constructor(private authService: AuthService) { }

  register(): void {
    // Desestructuramos los valores de registerData y los pasamos como argumentos
    this.authService.register(
      this.firstName,
      this.lastName,
      this.username,
      this.password
    ).subscribe(
      (response) => {
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: 'Registro Exitoso!',
          text: 'Bienvenido, ya puedes iniciar sesión.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a la página de login
          window.location.href = '/auth';
        });
      },
      (error) => {
        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema con el registro. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  goToLogin() {
    this.switchToLogin.emit();  // Emitimos el evento cuando se hace clic en "Inicia sesión"
  }
}
