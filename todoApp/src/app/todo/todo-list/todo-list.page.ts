import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDoContent } from 'src/app/model/todo-content';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user-model';
import { AlertController, ToastController } from '@ionic/angular';
import { TodoListService } from 'src/app/services/todo-list.service';

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
  previewText : string = '';

  constructor(
    private todoService: TodoListService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.todoContentForm = new FormGroup({
      newTodoText: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
     //Récupération de l'utilisateur courant
    this.currentUser = this.authService.getCurrentUser();
    //Vérification de l'utilisateur, s'il n'est pas connecté, on renvoie l'utilisateur à la page d'accueil (en plus du guard mis en place)
    if (this.currentUser) {
      this.todoList = this.currentUser.todoList.filter(task => task.toDoText !== '');
    } else {
      this.router.navigate(['/home']);
    }
  }

  //Navigue vers le détail de la tâche
  goToTaskDetail(id: string) {
    this.router.navigate(['/todo-task', id]);
  }

  //Charge toute la liste des todo en filtrant la tâche initiale template vide
  loadTodos() {
    this.todoList = this.todoService.getCurrentUserTodoList().filter(task => task.toDoText !== '');
  }
  
  refreshTodoList() {
    // Recharge l'affichage de la todo list
    this.loadTodos();
  }

  //Passe l'état de la tâche à complétée
  completeToDoContent(todo: ToDoContent) {
    todo.completed = !todo.completed;
    this.updateUserTodoList();
  }
  
  //Récupération d'une partie du texte de détails pour en faire un aperçu
  getPreviewText(details: string): string {
    const maxLength = 50; // Longueur maximale de l'aperçu
    return details.length > maxLength ? details.substring(0, maxLength) + '...' : details;
  }

  //Ajout d'une tâche à la liste de todo
  async addTodoTask() {
    if (this.todoContentForm.valid) {
      const newTodo: ToDoContent = {
        id: Date.now().toString(),
        toDoText: this.todoContentForm.controls["newTodoText"].value,
        completed: false,
        details: '',
        imageUrl: ''
      };
      
      //Demande à l'utilisateur s'il souhaite ajouter un détail dès la création de sa tâche
      const alert = await this.alertController.create({
        header: 'Add Details',
        message: 'Do you want to add details to this task?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              this.todoService.addTodoTask(newTodo);
              this.todoList.push(newTodo); // Mise à jour de la vue locale
              this.todoContentForm.reset();
            },
          },
          {
            text: 'Yes',
            handler: () => {
              this.addDetailsDuringTaskCreation(newTodo);
            },
          },
        ],
      });
  
      await alert.present();
    }
  }

  //Pop up d'ajout de texte pour le détail de la tâche
  async addDetailsDuringTaskCreation(newTodo: ToDoContent) {
    const alert = await this.alertController.create({
      header: 'Enter Details',
      inputs: [
        {
          name: 'details',
          type: 'textarea',
          placeholder: 'Enter task details here...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
              newTodo.details = data.details;
              this.todoService.addTodoTask(newTodo);
              this.todoList.push(newTodo); // Mise à jour de la vue locale
              this.todoContentForm.reset()
          },
        },
      ],
    });

    await alert.present();
  }

  //Pop up de confirmation de suppression de la tâche
  async confirmRemoveTaskFromList(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm removal',
      message: 'Are you sure you want to delete this task ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeToDoTaskFromList(id);
          }
        }
      ]
    });

    await alert.present();
  }

  //Suppression de la tâche dans la liste
  async removeToDoTaskFromList(id: string) {
    this.todoList = this.todoList.filter(todo => todo.id !== id);
    this.updateUserTodoList();

    const toast = await this.toastController.create({
      message: 'Your task has been deleted successfuly.',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  } 

  //Mise à jour de la todo list lié à l'utilisateur
  private updateUserTodoList() {
    if (this.currentUser) {
      this.currentUser.todoList = this.todoList;
      this.authService.updateCurrentUser(this.currentUser).subscribe(
        () => console.log('Todo list updated successfully'),
        error => console.error('Error updating todo list:', error)
      );
    }
  }

  //Déconnexion de l'utilisateur
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}