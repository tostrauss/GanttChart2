// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DataInputComponent } from './app/data-input/data-input.component';
import { GanttChartComponent } from './app/gantt-chart/gantt-chart.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [
        { path: '', redirectTo: '/data-input', pathMatch: 'full' },
        { path: 'data-input', component: DataInputComponent },
        { path: 'gantt-chart', component: GanttChartComponent }
      ],
      // This plugin helps with automatic input binding if needed:
      withComponentInputBinding()
    )
  ]
});
