import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoContent } from 'src/app/model/todo-content';
import { AuthService } from 'src/app/services/auth.service';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
})
export class TodoListPage implements OnInit {
  todoList: ToDoContent[] = [];
  todoContentForm: FormGroup;
  newTodoText: string = '';

  constructor(
    private todoService: TodoListService,
    private authService: AuthService,
    private router: Router
  ) {
    this.todoContentForm = new FormGroup({
      newTodoText: new FormControl('', Validators.required),
      details: new FormControl('Test', Validators.required)
    });
  }

  ngOnInit() {
    this.loadTodos(); // Charger les tâches lors de l'initialisation
  }

  loadTodos() {
    this.todoList = this.todoService.getAllTodos(); // Récupérer les tâches de l'utilisateur actuel
  }

  goToTaskDetail(id: string) {
    this.router.navigate(['/todo-task', id]);
  }

  completeToDoContent(todo: ToDoContent) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo);
  }

  addTodoTask() {
    if (this.newTodoText.trim() !== '') {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: this.todoContentForm.controls["newTodoText"].value,
        completed: false,
        details: this.todoContentForm.controls["details"].value
      };
      this.todoService.addTodoTask(newTodo); // Ajouter une nouvelle tâche
      this.newTodoText = '';
      this.loadTodos(); // Recharger les tâches après ajout
    }
  }

  removeToDoTaskFromList(id: string) {
    this.todoService.removeToDoTaskFromList(id); // Supprimer une tâche par son ID
    this.loadTodos(); // Recharger les tâches après suppression
  }

  logout() {
    this.authService.logout(); // Appeler la méthode logout du service d'authentification
    this.router.navigate(['/home']); // Rediriger vers la page de connexion
  }
}