import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ToDoContent } from 'src/app/model/todo-content';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./todo-task.component.scss'],
  standalone: true,
})
export class TodoTaskComponent  implements OnInit {
  todo: ToDoContent | undefined;

  public task : ToDoContent = <ToDoContent>{}
  id = this.route.snapshot.paramMap.get('id');
  constructor(private todoService: TodoListService, private route : ActivatedRoute,
    private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit(): void {
    if (this.id) {
      this.todo = this.todoService.getTodoById(this.id);
    }

  }

  //Pop up de confirmation de suppression de l'image
  async confirmRemoveImage() {
    const alert = await this.alertController.create({
      header: 'Confirm removal',
      message: 'Are you sure you want to delete this image ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeImage();
          }
        }
      ]
    });

    await alert.present();
  }

  //Ajout d'une photo à la tâche choisie
  async addPhotoToTodo() {
    if (this.todo) {
      try {
        await this.todoService.takePictureForTodo(this.todo.id);
        
        // Créer et afficher la popup de confirmation
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Your image has been added successfully !',
          buttons: ['OK']
        });
        await alert.present();
  
        // Attendre que l'utilisateur ferme la popup
        await alert.onDidDismiss();
  
        // Recharger la page de manière transparente
        if(this.id){
          this.todo = this.todoService.getTodoById(this.id);
        }
  
      } catch (error) {
        console.error('Error adding the photo', error);
        // Optionnel : Afficher une popup d'erreur
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'An error happened during the upload',
          buttons: ['OK']
        });
        await errorAlert.present();
      }
    }
  }

  //Suppression de l'image
  async removeImage() {
    if (this.todo) {
      this.todo.imageUrl = '';
      this.updateTodoDetails();

      const toast = await this.toastController.create({
        message: 'Image has been deleted successfuly',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  //Mise à jour du détails
  updateTodoDetails() {
    if (this.todo) {
      this.todoService.updateTodoDetails(this.todo.id, this.todo);
    }
  }

}
