import { Component } from '@angular/core';
import { ToDoList } from '../to-do-list';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todoList: ToDoList[] = [];
  newTodoText: string = '';

  constructor() {}

  addTodo() {
    if (this.newTodoText !== '') {
      this.todoList.push({
        toDoContent: this.newTodoText 
      }
      );
      this.newTodoText = '';
    }
  }

  removeToDo(){
    this.todoList = this.todoList
  }
}