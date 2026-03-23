import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-mining-dashboard',
  standalone: true,  // <-- Add this explicitly
  imports: [CommonModule],
  templateUrl: './mining-dashboard.html',
  styleUrl: './mining-dashboard.scss',
})
export class MiningDashboard implements OnInit, OnDestroy {

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
  // Load available resources
  this.apiService.getAvailableResources().subscribe({
    next: (data) => {
      this.availableOres = data.availableOres;
      this.miningLevel = data.miningLevel;
      this.currentXp = data.currentXp;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error fetching available resources:', error);
    }
  });

  // Check for active mining task
  this.apiService.getMiningStatus().subscribe({
    next: (data) => {
      if (data && data.totalCyclesCompleted !== undefined) {
        // Active task exists - restore state and start polling
        this.isMining = true;
        this.miningStatus = data;
        this.cyclesCompleted = data.totalCyclesCompleted;
        this.currentCycle = data.currentCycle;
        this.elapsedTime = data.elapsedTime;
        this.damagePerSwing = data.damagePerSwing;
        this.cdr.detectChanges();
        this.pollMiningStatus(); // Start real-time updates
      }
    },
    error: (err) => {
      console.log('No active mining task');
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
      if (this.isMining) {
        this.apiService.getMiningStatus().subscribe({
  next: (data) => {
            if (data && data.totalCyclesCompleted !== undefined) {
              this.isMining = true;
              this.miningStatus = data;
              this.cyclesCompleted = data.totalCyclesCompleted;
              this.currentCycle = data.currentCycle;
              this.elapsedTime = data.elapsedTime;
              this.damagePerSwing = data.damagePerSwing;
              // Add this if you have resourceId in the response:
              // this.selectedOreId = data.resourceId;
              this.cdr.detectChanges();
              this.pollMiningStatus();
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

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

}
