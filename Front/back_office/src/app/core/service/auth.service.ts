// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/token/';  // L'URL de ton endpoint Django

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir un token avec le login et le mot de passe
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password })
      .pipe(
        catchError(error => {
          throw new Error('Invalid credentials or server error');
        })
      );
  }

  // Méthode pour vérifier si l'utilisateur est connecté (le token est dans localStorage)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Méthode pour se déconnecter (effacer le token)
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Méthode pour obtenir le token d'accès depuis le localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Méthode pour obtenir le token de rafraîchissement depuis le localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Méthode pour ajouter le token dans l'en-tête de requêtes HTTP
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
