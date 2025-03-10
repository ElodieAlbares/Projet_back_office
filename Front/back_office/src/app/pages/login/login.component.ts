// auth/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Enregistrer les tokens dans le localStorage
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Rediriger vers la page d'accueil ou une page protégée
        this.router.navigate(['/home']);
      },
      (error) => {
        // Gérer l'erreur (ex: identifiants invalides)
        this.errorMessage = 'Identifiants incorrects';
      }
    );
  }
}
