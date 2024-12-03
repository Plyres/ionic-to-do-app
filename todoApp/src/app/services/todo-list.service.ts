import { Injectable } from '@angular/core';
import { ToDoContent } from '../model/todo-content';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  
  todoList: ToDoContent[] = [];
  
  constructor() {}
 
  getAllTodos(): ToDoContent[] {
    return this.todoList;
  }

  getTodoById(id: string): ToDoContent | undefined {
    return this.todoList.find(todo => todo.id === id);
  }

  addTodo(todo: ToDoContent) {
    this.todoList.push(todo);
  }

  updateTodo(todo: ToDoContent) {
    const index = this.todoList.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.todoList[index] = todo;
    }
  }

  removeToDoContentFromList(id: string) {
    this.todoList = this.todoList.filter(todo => todo.id !== id);
  }
}
