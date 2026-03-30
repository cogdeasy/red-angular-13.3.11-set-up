import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (this.currentUser) {
      this.editForm = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone
      };
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (this.currentUser) {
      this.currentUser.firstName = this.editForm.firstName;
      this.currentUser.lastName = this.editForm.lastName;
      this.currentUser.email = this.editForm.email;
      this.currentUser.phone = this.editForm.phone;
    }
    this.isEditing = false;
  }
}
