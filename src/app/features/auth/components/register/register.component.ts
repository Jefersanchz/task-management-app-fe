import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() switchToLogin = new EventEmitter<void>();  // Creamos un EventEmitter para cambiar a la vista de login

  username: string = '';  // Variable para almacenar el nombre de usuario
  email: string = '';     // Variable para almacenar el correo electrónico
  password: string = '';  // Variable para almacenar la contraseña

  // Método para manejar el envío del formulario de registro
  register(): void {
    // Lógica de registro aquí
    console.log('Usuario:', this.username);
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);

    // Aquí puedes implementar la lógica para registrar al usuario
    // Como enviar estos datos a un backend o almacenarlos en localStorage
  }
  goToLogin() {
    this.switchToLogin.emit();  // Emitimos el evento cuando se hace clic en "Inicia sesión"
  }
}
