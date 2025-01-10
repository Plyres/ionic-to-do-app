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

  // Simple encryption function
  encryptPassword(password: string): string {
    return btoa(password); // Base64 encoding
  }
  
  get email() { return this.signUpForm.get('email') as FormControl; }
  get password() { return this.signUpForm.get('password') as FormControl; }
  

  async register() {
    try {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: '',
        completed: false,
        details: "",
        imageUrl: ''
      };
      
      this.todoList.push(newTodo);
      const email = this.email;
      const password = this.password;
      const encryptedPassword = this.encryptPassword(password.value);
      await this.authService.register(email.value, encryptedPassword, this.todoList);
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