import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class Navigation implements OnInit {

  username: string = '';
  totalLevel: number = 0;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.apiService.getCharacterStats().subscribe({
      next: (stats) => {
        this.username = stats.username;
        this.totalLevel = stats.totalLevel;
        this.cdr.detectChanges();
        console.log('Character stats fetched successfully:', stats);
      },
      error: (err) => {
        console.error('Error fetching character stats:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
