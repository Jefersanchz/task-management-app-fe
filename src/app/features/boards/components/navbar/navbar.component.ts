import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service'; 
import { Router } from '@angular/router'; // Importa Router para redirigir al usuario tras cerrar sesión

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  fullName: string = 'Usuario'; // Valor por defecto

  constructor(private authService: AuthService, private router: Router) {} // Inyecta el AuthService y Router

  ngOnInit(): void {
    // Recuperar datos del usuario desde el localStorage
    const user = localStorage.getItem('user'); 
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.fullName = `${userData.firstName} ${userData.lastName}`.trim() || 'Usuario';
      } catch (error) {
        console.error('Error al parsear los datos del localStorage:', error);
      }
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.clearUserSession(); // Limpia la sesión del usuario
    this.router.navigate(['/auth']); // Redirige al usuario a la página de autenticación
  }
}
