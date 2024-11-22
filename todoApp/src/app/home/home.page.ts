import { Component } from '@angular/core';
import { ToDoContent } from '../to-do-content';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todoList: ToDoContent[] = [];
  newTodoText: string = '';

  constructor() {}

  addTodo() {
    if (this.newTodoText !== '') {
      this.todoList.push({
        toDoText: this.newTodoText,
        completed: false
      }
      );
      this.newTodoText = '';
    }
  }

  completeToDoContent(todo: ToDoContent) {
    todo.completed = !todo.completed;
  }

  removeToDoContentFromList(todo: ToDoContent) {
    const index = this.todoList.indexOf(todo);
    if (index > -1) {
      this.todoList.splice(index, 1);
    }
  }
}