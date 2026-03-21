import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-mining-dashboard',
  standalone: true,  // <-- Add this explicitly
  imports: [CommonModule],
  templateUrl: './mining-dashboard.html',
  styleUrl: './mining-dashboard.scss',
})
export class MiningDashboard implements OnInit {

  miningLevel: number = 0; // Placeholder for mining level, to be updated with actual data
  currentXp: number = 0; // Placeholder for current XP, to be updated with actual data
  availableOres: any[] = []; // Placeholder for available ores, to be updated with actual data
  selectedOreId: number | null = null; // Placeholder for selected ore ID, to be updated with actual data
  isMining: boolean = false; // Placeholder for mining status, to be updated with actual data
  miningStatus: any = null; // Placeholder for mining status, to be updated with actual data
  cyclesCompleted: number = 0; // Placeholder for cycles completed, to be updated with actual data
  currentCycle: any = null; // Placeholder for current cycle progress, to be updated with actual data
  elapsedTime: number = 0; // Placeholder for elapsed time, to be updated with actual data
  damagePerSwing: number = 0; // Placeholder for damage per swing, to be updated with actual data
  pollingInterval: any = null


constructor(
  private apiService: ApiService,
  private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
  this.apiService.getAvailableResources().subscribe({
    next: (data) => {
      this.availableOres = data.availableOres;
      this.miningLevel = data.miningLevel;
      this.currentXp = data.currentXp;
      this.cdr.detectChanges(); // <-- Must have this
    },
    error: (error) => {
      console.error('Error fetching available resources:', error);
    }
  });
}

  startMining(oreId: number): void {
    this.selectedOreId = oreId;
    this.isMining = true;
    this.apiService.startMining(oreId).subscribe({
      next: (data) => {
        console.log('Mining started:', data);
        // Update mining status with the response from the API
        this.miningStatus = data; // Assuming the API returns mining status
        this.pollMiningStatus(); // Start polling for mining status updates
      },
      error: (error) => {
        console.error('Error starting mining:', error);
        this.isMining = false; // Reset mining status on error
      }
    });
  }

  pollMiningStatus(): void {
    this.pollingInterval = setInterval(() => {
      if (this.isMining && this.selectedOreId !== null) {
        this.apiService.getMiningStatus().subscribe({
          next: (data) => {
            console.log('Mining status:', data);
            // Update mining status with the response from the API
            this.miningStatus = data; // Assuming the API returns mining status
            if (data) {
              this.cyclesCompleted = data.totalCyclesCompleted; // Assuming the API returns cycles completed
              this.currentCycle = data.currentCycle; // Assuming the API returns current progress
              this.elapsedTime = data.elapsedTime; // Assuming the API returns elapsed time
              this.damagePerSwing = data.damagePerSwing; // Assuming the API returns damage per swing
              this.cdr.detectChanges(); // <-- This line must be here
            }
          },
          error: (error) => {
            console.error('Error fetching mining status:', error);
            this.isMining = false; // Reset mining status on error
          }
        });
      }
    }, 3000); // Poll every 5 seconds
  }

stopMining(): void {
  // Stop polling first
  if (this.pollingInterval) {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  }
  
  // Call backend to stop the task
  this.apiService.stopMining().subscribe({
    next: (response) => {
      console.log('Mining stopped:', response);
      this.isMining = false;
      this.selectedOreId = null;
      this.miningStatus = null;
      this.currentCycle = null;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error stopping mining:', error);
      // Still stop locally even if API fails
      this.isMining = false;
    }
  });
}

  get ores() {
  console.log('Getter called, availableOres:', this.availableOres);
  return this.availableOres || [];
}

}
