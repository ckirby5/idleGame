import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api';

@Component({
  selector: 'app-active-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-task-card.html',
  styleUrl: './active-task-card.scss'
})
export class ActiveTaskCard implements OnInit, OnDestroy {
  hasActiveTask: boolean = false;
  taskType: string = '';
  resourceName: string = '';
  skillType: string = '';
  cyclesCompleted: number = 0;
  currentProgress: any = null;
  elapsedTime: number = 0;
  damagePerSwing: number = 0;
  
  pollingInterval: any = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  this.fetchActiveTask();
  // Poll every 3 seconds regardless of task status
  this.pollingInterval = setInterval(() => {
    this.fetchActiveTask();  // Remove the if condition
  }, 3000);
}

ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  fetchActiveTask(): void {
    this.apiService.getActiveTask().subscribe({
      next: (data) => {
        this.hasActiveTask = data.hasActiveTask;
        if (data.hasActiveTask) {
          this.taskType = data.taskType;
          this.resourceName = data.resourceName;
          this.skillType = data.skillType;
          this.cyclesCompleted = data.cyclesCompleted;
          this.currentProgress = data.currentProgress;
          this.elapsedTime = data.elapsedTime;
          this.damagePerSwing = data.damagePerSwing;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching active task:', err);
      }
    });
  }

  formatElapsedTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}