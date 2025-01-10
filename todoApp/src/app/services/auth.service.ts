import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../model/user-model';
import { ToDoContent } from '../model/todo-content';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private apiService: ApiService) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this._isAuthenticated.next(true);
    }
  }

  register(email: string, password: string, todoList: Array<ToDoContent>) {
    const newUser: User = { email, password, todoList };
    this.apiService.postData(`users/${email}`, JSON.stringify(newUser)).subscribe(x => {x})
  }

  login(email: string, password: string): Observable<void> {
    return this.apiService.getData(`users/${email}`).pipe(
      map((response: any) => {
        let user: User;
  
        if (response && typeof response === 'object') {
          if (response.email) {
            // Le cas où la réponse est directement l'objet utilisateur
            user = response as User;
          } else {
            // Le cas où la réponse est un objet contenant l'utilisateur sous une clé
            const userKey = Object.keys(response)[0];
            user = response[userKey] as User;
          }
        } else {
          throw new Error('Invalid response format');
        }
        const decryptedPassword = this.decryptPassword(user.password);
        if (user && decryptedPassword === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._isAuthenticated.next(true);
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }

  // Décryptage du mdp utilisateur
  decryptPassword(encryptedPassword: string): string {
    return atob(encryptedPassword); // Décodage Base64
  }


  logout() {
    localStorage.removeItem('currentUser');
    this._isAuthenticated.next(false);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateCurrentUser(user: User): Observable<void> {
    return this.apiService.putData(`users/${user.email}`, JSON.stringify(user)).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }
}