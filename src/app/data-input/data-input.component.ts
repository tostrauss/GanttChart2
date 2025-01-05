import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  standalone: true,
  selector: 'app-data-input',
  templateUrl: './data-input.component.html',
  styleUrls: ['./data-input.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DataInputComponent {
  // Form fields
  dependencies = '';
  name = '';
  startDate: string = ''; // string for date input
  endDate: string = '';
  priority = 'Low';
  percentageOfCompletion = 0;

  constructor(private taskService: TaskService, private router: Router) {}

  addTask() {
    if (!this.name || !this.startDate || !this.endDate) {
      alert('Please fill in Task Name, Start Date, and End Date.');
      return;
    }

    const newTask: Task = {
      name: this.name,
      dependencies: this.dependencies,
      start_date: new Date(this.startDate),
      end_date: new Date(this.endDate),
      priority: this.priority,
      progress: this.percentageOfCompletion / 100
    };

    this.taskService.addTask(newTask);

    // Reset form
    this.dependencies = '';
    this.name = '';
    this.startDate = '';
    this.endDate = '';
    this.priority = 'Low';
    this.percentageOfCompletion = 0;

    this.router.navigate(['/gantt-chart']);
  }
}
