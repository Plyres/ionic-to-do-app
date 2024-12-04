import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoContent } from 'src/app/model/todo-content';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user-model';

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
    private formBuilder: FormBuilder
  ) {
    this.todoContentForm = new FormGroup({
      newTodoText: new FormControl('', Validators.required),
      details: new FormControl('Test', Validators.required)
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.todoList = this.currentUser.todoList || [];
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
        details: this.todoContentForm.controls["details"].value
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
}