import { ToDoContent } from "./todo-content";

export interface User {
    email: string;
    password: string;
    todoList: ToDoContent[];
}