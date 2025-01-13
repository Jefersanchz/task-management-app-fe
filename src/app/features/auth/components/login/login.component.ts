import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // Asegúrate de importar el AuthService
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';  // Para mostrar errores en el formulario

  constructor(private authService: AuthService) { }

  @Output() switchToRegister = new EventEmitter<void>();  // EventEmitter para cambiar a la vista de registro

  // Método de login
  onLogin(): void {
    this.authService.login(this.username, this.password)
      .subscribe(
        (response) => {
          console.log('Login exitoso', response);
          // Almacenar la sesión del usuario
          this.authService.storeUserSession(response);
  
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            title: 'Login Exitoso!',
            text: 'Bienvenido',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Redirigir a la página principal
            window.location.href = '/boards';
          });
        },
        (error) => {
          console.error('Error en el login', error);
  
          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
  
          // Asignar un mensaje de error al formulario si es necesario
          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
      );
  }
  


  // Cambiar a la vista de registro
  goToRegister() {
    this.switchToRegister.emit();  // Emitir evento para cambiar a la vista de registro
  }
}
