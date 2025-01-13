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

  //Sauvegarde dans la base de données de l'utilisateur
  register(email: string, password: string, todoList: Array<ToDoContent>) {
    const newUser: User = { email, password, todoList };
    this.apiService.postData(`users/${email}`, JSON.stringify(newUser)).subscribe(x => {x})
  }

  //Vérification que l'email rentré par l'utilisateur lors de l'inscription n'est pas déjà présente
  checkEmailExists(email: string): Observable<boolean> {
    return this.apiService.getData(`users/${email}`).pipe(
      map((response: any) => {
        if (response && typeof response === 'object') {
          if (response.email === email) {
            // Le cas où la réponse est directement l'objet utilisateur
            return true;
          } else {
            // Le cas où la réponse est un objet contenant l'utilisateur sous une clé
            const userKey = Object.keys(response)[0];
            if (userKey === email) {
              console.log(userKey);
              return true;
            }
            return false;
          }
        } else {
          return false;
        }
      }),
    );
  }
  

  //Méthode de connexion de l'utilisateur
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
        //Décryptage du mot de passe pour permettre de vérifier la correspondance entre l'entrée utilisateur
        //et l'entrée en base
        const decryptedPassword = this.decryptPassword(user.password);
        if (user && decryptedPassword === password) {
          //Stockage dans le local storage pour permettre de connaitre l'utilisateur actuel
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

  //Déconnexion de l'utilisateur en supprimant l'entrée dans le local storage
  logout() {
    localStorage.removeItem('currentUser');
    this._isAuthenticated.next(false);
  }

  //Récupération de l'utilisateur actuellement connecté
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  //Mise à jour des données de l'utilisateur principalement utilisé pour l'ajout ou la modification des task
  updateCurrentUser(user: User): Observable<void> {
    return this.apiService.putData(`users/${user.email}`, JSON.stringify(user)).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  //Vérifie que l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }
}