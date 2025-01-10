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

  public id : number = this.route.snapshot.params["id"];

  constructor(private todoService: TodoListService, private route : ActivatedRoute,
    private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
;
    if (id) {
      this.todo = this.todoService.getTodoById(id);
    }

  }

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

  async addPhotoToTodo() {
    if (this.todo) {
      try {
        await this.todoService.takePictureForTodo(this.todo.id);
        this.todo = this.todoService.getTodoById(this.todo.id);
      } catch (error) {
        console.error('Error adding the photo', error);
      }
    }
  }
  
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

  updateTodoDetails() {
    if (this.todo) {
      this.todoService.updateTodoDetails(this.todo.id, this.todo);
    }
  }

}
