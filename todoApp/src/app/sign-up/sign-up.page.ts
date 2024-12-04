import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToDoContent } from '../model/todo-content';

@Component({
  selector: 'app-register',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  email: string = '';
  password: string = '';
  todoList: Array<ToDoContent> = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async register() {
    try {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: '',
        completed: false,
        details: ""
      };
      
      this.todoList.push(newTodo);
      await this.authService.register(this.email, this.password, this.todoList);
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