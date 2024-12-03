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
    console.log(id);
    if (id) {
      this.todo = this.todoService.getTodoById(id);
    }
  }
  

}
