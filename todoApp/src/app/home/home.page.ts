import { Component } from '@angular/core';
import { ToDoContent } from '../model/todo-content';
import { Router } from '@angular/router';
import { TodoListService } from '../services/todo-list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todoList: ToDoContent[] = [];
  newTodoText: string = '';

  constructor(private todoService: TodoListService, private router: Router) {}

  goToTaskDetail(id: string) {
    this.router.navigate(['/todo-task', id]);
  }

  completeToDoContent(todo: ToDoContent) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo);
  }

  loadTodos() {
    this.todoList = this.todoService.getAllTodos();
  }

  addTodo() {
    if (this.newTodoText.trim() !== '') {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: this.newTodoText,
        completed: false,
        details: 'Test'
      };
      this.todoService.addTodo(newTodo);
      this.newTodoText = '';
      this.loadTodos();
    }
  }

  removeToDoContentFromList(id: string) {
    this.todoService.removeToDoContentFromList(id);
    this.loadTodos();
  }
}