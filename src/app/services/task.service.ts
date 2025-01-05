import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private idCounter = 1;

  constructor() {}

  getTasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    // Assign a unique ID
    task.id = this.idCounter++;
    this.tasks.push(task);
    this.tasksSubject.next([...this.tasks]); // Emit updated array
  }
}
