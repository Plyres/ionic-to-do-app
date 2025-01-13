import { Injectable } from '@angular/core';
import { ToDoContent } from '../model/todo-content';
import { AuthService } from './auth.service';
import { CameraService } from './camera.service';
@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  private userId: string | null = null;

  todoList: ToDoContent[] = [];

  constructor(private authService: AuthService, private cameraService: CameraService) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userId = JSON.parse(currentUser).email;
    }
  }

  //Récupération de toutes les tâches d'un utilisateur
  getCurrentUserTodoList(): ToDoContent[] {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.todoList : [];
  }

  //Récupération d'une tâche précise selon son ID
  getTodoById(id: string): ToDoContent | undefined {
    const todoList = this.getCurrentUserTodoList();
    return todoList.find(todo => todo.id === id);
  }

  //Méthode d'ajout d'une tâche et mise à jour de l'utilisateur lié
  addTodoTask(todo: ToDoContent) {
    const todos = this.getCurrentUserTodoList();
    todos.push(todo);
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      currentUser.todoList = todos; 
      this.authService.updateCurrentUser(currentUser).subscribe();
    }
  }

  //Mise à jour de la tâche
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

  //Méthode qui appelle la méthode de prise de photo + mets à jour la tâche
  async takePictureForTodo(todoId: string): Promise<void> {
    try {
      const imageUrl = await this.cameraService.takePicture();
      
      if (imageUrl) {
        const todo = this.getTodoById(todoId);
        if (todo) {
          todo.imageUrl = imageUrl;
          this.updateTodo(todo);
        }
      }
    } catch (error) {

      throw error;
    }
  }

  //Mise à jour du détail de la tâche
  updateTodoDetails(todoId: string, updates: Partial<ToDoContent>) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      Object.assign(todo, updates);
      this.updateTodo(todo);
    }
  }
}
