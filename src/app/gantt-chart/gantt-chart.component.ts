import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// We import DHTMLX Gantt directly here:
import 'dhtmlx-gantt';

import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

declare let gantt: any; // declare the global

@Component({
  standalone: true,
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css'],
  imports: [CommonModule]
})
export class GanttChartComponent implements OnInit, OnDestroy {
  @ViewChild('ganttContainer', { static: true }) ganttContainer!: ElementRef;

  private tasksSub!: Subscription;
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    gantt.config.xml_date = '%d.%m.%Y';
    gantt.config.fit_tasks = true;
    // Init Gantt
    gantt.init(this.ganttContainer.nativeElement);

    // Listen for tasks
    this.tasksSub = this.taskService.getTasks$().subscribe((tasks) => {
      this.tasks = tasks;
      this.renderGantt();
    });
  }

  renderGantt(): void {
    // Clear existing Gantt data
    gantt.clearAll();

    if (!this.tasks || this.tasks.length === 0) {
      return;
    }

    // Convert tasks for DHTMLX
    // DHTMLX expects something like:
    // {
    //    id, text, start_date (string), end_date (string),
    //    progress, parent, ...
    // }
    const data = this.tasks.map((t) => ({
      id: t.id,
      text: t.name,
      start_date: gantt.date.date_to_str('%d-%m-%Y')(t.start_date),
      end_date: gantt.date.date_to_str('%d-%m-%Y')(t.end_date),
      progress: t.progress,
      // We'll handle dependencies separately
    }));

    // Build array of links if we have "dependencies" in CSV
    // e.g. "1,2" means this task depends on tasks with ID 1 and 2
    interface GanttLink {
      id: number;
      source: number;
      target: number;
      type: number;
    }
    
    const links: GanttLink[] = [];
    
    this.tasks.forEach(task => {
      if (task.dependencies) {
        const depIds = task.dependencies.split(',').map(d => d.trim());
        depIds.forEach(depId => {
          links.push({
            id: Math.random(),     // unique ID
            source: +depId,       // predecessor
            target: task.id!,      // successor
            type: 0               // 0 = finish-to-start
          });
        });
      }
    });

    // Load data
    gantt.parse({ data, links });
    gantt.setSizes();
  }

  ngOnDestroy(): void {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
    gantt.clearAll();
  }
}
