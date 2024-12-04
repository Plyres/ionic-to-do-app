import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ToDoContent } from 'src/app/model/todo-content';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  imports: [IonicModule, CommonModule],
  styleUrls: ['./todo-task.component.scss'],
  standalone: true,
})
export class TodoTaskComponent  implements OnInit {
  todo: ToDoContent | undefined;

  public task : ToDoContent = <ToDoContent>{}

  public id : number = this.route.snapshot.params["id"];

  constructor(private todoService: TodoListService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
;
    if (id) {
      this.todo = this.todoService.getTodoById(id);
    }
  }

  async addPhotoToTodo(todoId: string) {
    try {
      await this.todoService.takePictureForTodo(todoId);
      this.todo = this.todoService.getTodoById(todoId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo', error);
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }

}
