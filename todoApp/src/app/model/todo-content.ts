import { CameraResultType } from "@capacitor/camera";

export interface ToDoContent {
    id: string;
    toDoText: string;
    completed: boolean;
    details: string;
    imageUrl: string,
}
