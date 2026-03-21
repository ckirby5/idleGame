import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  email: string = '';
  password: string = ''
  username: string = '';
  
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }

}
