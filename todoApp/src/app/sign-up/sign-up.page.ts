import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToDoContent } from '../model/todo-content';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  signUpForm: FormGroup;
  todoList: Array<ToDoContent> = [];
  
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
   }

  // Cryptage du mdp pour qu'il ne soit pas visible dans la base de données
  encryptPassword(password: string): string {
    return btoa(password); // Base64 encoding
  }
  
  get email() { return this.signUpForm.get('email') as FormControl; }
  get password() { return this.signUpForm.get('password') as FormControl; }
  
  //Méthode d'inscription avec un formulaire avec validation du format de l'email et de la longueur du mdp + vérification que l'email n'est pas déjà dans la bdd
  async register() {
    try {
      const email = this.email.value;
      const password = this.password.value;

      const emailExists = await this.authService.checkEmailExists(email).toPromise();
      if (emailExists) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'This email is already used.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
      
      //Création d'une nouvelle tâche template vide pour permettre de l'ajouter dans le modèle de l'utilisateur 
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: '',
        completed: false,
        details: "",
        imageUrl: ''
      };
      
      this.todoList.push(newTodo);
      
      const encryptedPassword = this.encryptPassword(password);
      await this.authService.register(email, encryptedPassword, this.todoList);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Registration successful. Please log in.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigateByUrl('/home');
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'error',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}