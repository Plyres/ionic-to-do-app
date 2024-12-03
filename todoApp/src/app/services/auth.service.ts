import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

  constructor() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this._isAuthenticated.next(true);
    }
  }

  register(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingUser = this.users.find(u => u.email === email);
      if (existingUser) {
        reject('User already exists');
      } else {
        const newUser: User = { email, password, todoList: [] };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        resolve();
      }
    });
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user)); // Stocker l'utilisateur actuel
        this._isAuthenticated.next(true);
        resolve();
      } else {
        reject('Invalid email or password');
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this._isAuthenticated.next(false); // Marquer l'utilisateur comme non authentifié
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateCurrentUser(user: User) {
    const index = this.users.findIndex(u => u.email === user.email);
    if (index !== -1) {
      this.users[index] = user; // Mettre à jour l'utilisateur dans le tableau
      localStorage.setItem('users', JSON.stringify(this.users)); // Sauvegarder les utilisateurs mis à jour
      localStorage.setItem('currentUser', JSON.stringify(user)); // Mettre à jour l'utilisateur actuel
    }
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }
}