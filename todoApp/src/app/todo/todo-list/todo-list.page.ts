import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoContent } from 'src/app/model/todo-content';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user-model';
import { AlertController } from '@ionic/angular';
import { CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
})
export class TodoListPage implements OnInit {
  todoList: ToDoContent[] = [];
  todoContentForm: FormGroup;
  currentUser: User | null = null;
  newTodoText: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.todoContentForm = new FormGroup({
      newTodoText: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.todoList = this.currentUser.todoList;
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToTaskDetail(id: string) {
    this.router.navigate(['/todo-task', id]);
  }

  completeToDoContent(todo: ToDoContent) {
    todo.completed = !todo.completed;
    this.updateUserTodoList();
  }

  addTodoTask() {
    if (this.todoContentForm.valid) {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText:this.todoContentForm.controls["newTodoText"].value,
        completed: false,
        details: '',
        imageUrl: ''
      };
      this.todoList.push(newTodo);
      this.updateUserTodoList();
      this.todoContentForm.reset();
    }
  }

  removeToDoTaskFromList(id: string) {
    this.todoList = this.todoList.filter(todo => todo.id !== id);
    this.updateUserTodoList();
  }

  private updateUserTodoList() {
    if (this.currentUser) {
      this.currentUser.todoList = this.todoList;
      this.authService.updateCurrentUser(this.currentUser).subscribe(
        () => console.log('Todo list updated successfully'),
        error => console.error('Error updating todo list:', error)
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  async updateTodoTask(todo: ToDoContent) {
    const alert = await this.alertController.create({
      header: 'Update Todo',
      inputs: [
        {
          name: 'toDoText',
          type: 'text',
          value: todo.toDoText,
          placeholder: 'Todo Text'
        },
        {
          name: 'details',
          type: 'textarea',
          value: todo.details,
          placeholder: 'Details'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: (data) => {
            todo.toDoText = data.toDoText;
            todo.details = data.details;
            this.updateUserTodoList();
          }
        }
      ]
    });

    await alert.present();
  }
}