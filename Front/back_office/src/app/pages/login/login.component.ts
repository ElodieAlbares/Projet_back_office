import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule,CommonModule,MatFormField,MatLabel,MatCardModule,MatError,MatFormFieldModule,MatInputModule,ReactiveFormsModule,MatButtonModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
     
      this.authService.login(username!,password!).subscribe(
        (response) => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
  
          this.router.navigate(['/products']);
        },
        (error) => {
          this.errorMessage = 'Identifiants incorrects';
        }
      );
     }
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  clickEvent(event: Event): void {
    event.stopPropagation();  
    event.preventDefault();
    this.togglePasswordVisibility(); 
  }
  hide(): boolean {
    return this.hidePassword;
  }
}
