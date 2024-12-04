import { Injectable } from '@angular/core';
import { ToDoContent } from '../model/todo-content';
import { AuthService } from './auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  private userId: string | null = null;

  todoList: ToDoContent[] = [];

  constructor(private authService: AuthService) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userId = JSON.parse(currentUser).email;
    }
  }

  private getCurrentUserTodoList(): ToDoContent[] {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.todoList : [];
  }

  getAllTodos(): ToDoContent[] {
    return this.getCurrentUserTodoList();
  }

  getTodoById(id: string): ToDoContent | undefined {
    const todoList = this.getCurrentUserTodoList();
    return todoList.find(todo => todo.id === id);
  }

  addTodoTask(todo: ToDoContent) {
    const todos = this.getCurrentUserTodoList();
    todos.push(todo);
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      currentUser.todoList = todos; 
      this.authService.updateCurrentUser(currentUser);
    }
  }

  updateTodo(updatedTodo: ToDoContent) {
    const todos = this.getCurrentUserTodoList();
    const index = todos.findIndex(t => t.id === updatedTodo.id);

    if (index !== -1) {
      todos[index] = updatedTodo; 
      const currentUser = this.authService.getCurrentUser();

      if (currentUser) {
        currentUser.todoList = todos;
        this.authService.updateCurrentUser(currentUser).subscribe();
      }
    }
  }

  removeToDoTaskFromList(id: string) {
    const todos = this.getCurrentUserTodoList();
    const updatedTodos = todos.filter(t => t.id !== id); 
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      currentUser.todoList = updatedTodos;
      this.authService.updateCurrentUser(currentUser);
    }
  }

  async takePictureForTodo(todoId: string): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      if (image.dataUrl) {
        const todo = this.getTodoById(todoId);
        if (todo) {
         
          todo.imageUrl = image.dataUrl;
          console.log(todo.imageUrl)
          this.updateTodo(todo);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo', error);
      throw error;
    }
  }
}
