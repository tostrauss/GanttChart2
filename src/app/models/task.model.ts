export interface Task {
    id?: number;             // auto-assigned ID
    name: string;            // Task name
    dependencies?: string;   // CSV of numeric IDs
    start_date: Date;
    end_date: Date;
    priority: string;        // Low, Medium, High
    progress: number;        // 0..1 (represents completion)
  }
  