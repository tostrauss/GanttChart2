import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import 'dhtmlx-gantt';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

declare let gantt: any;

@Component({
  standalone: true,
  selector: 'app-gantt-chart',
  template: `
    <div class="gantt-chart-container">
      <div #ganttContainer class="gantt-container"></div>
    </div>
  `,
  styles: [`
    .gantt-chart-container {
      height: 600px;
      width: 100%;
    }
    .gantt-container {
      width: 100%;
      height: 100%;
    }
  `],
  imports: [CommonModule]
})
export class GanttChartComponent implements OnInit, OnDestroy {
  @ViewChild('ganttContainer', { static: true }) ganttContainer!: ElementRef;
  private tasksSub!: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Basic configuration
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.scale_height = 50;
    gantt.config.row_height = 30;
    
    // Scale configuration
    gantt.config.scales = [
      {unit: "month", step: 1, format: "%F, %Y"},
      {unit: "day", step: 1, format: "%j, %D"}
    ];

    // Initialize gantt
    gantt.init(this.ganttContainer.nativeElement);

    // Subscribe to tasks
    this.tasksSub = this.taskService.getTasks$().subscribe(tasks => {
      if (tasks && tasks.length > 0) {
        const ganttData = {
          data: tasks.map(task => ({
            id: task.id,
            text: task.name,
            start_date: this.formatDate(task.start_date),
            end_date: this.formatDate(task.end_date),
            progress: task.progress,
            priority: task.priority
          }))
        };
        gantt.clearAll();
        gantt.parse(ganttData);
      }
    });
  }

  private formatDate(date: Date): string {
    if (date instanceof Date) {
      return gantt.date.date_to_str("%Y-%m-%d")(date);
    }
    return gantt.date.date_to_str("%Y-%m-%d")(new Date(date));
  }

  ngOnDestroy(): void {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
  }
}