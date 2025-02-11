import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../layouts/header/header.component';
import {ProfileService} from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: any;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.updatePoints();
  }

  loadUserProfile() {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue(profile);
      },
      error: (error) => console.error('Error loading profile:', error)
    });
  }

  updatePoints() {
    this.profileService.calculateAndUpdatePoints().subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
      },
      error: (error) => console.error('Error updating points:', error)
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.userProfile);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.profileService.updateUserProfile(this.profileForm.value).subscribe({
        next: (updatedProfile) => {
          this.userProfile = updatedProfile;
          this.isEditing = false;
        },
        error: (error) => console.error('Error updating profile:', error)
      });
    }
  }

  convertPoints(amount: number) {
    this.profileService.convertPoints(amount).subscribe({
      next: (result) => {
        this.userProfile = result;
        // Afficher un message de succès
      },
      error: (error) => {
        console.error('Error converting points:', error);
        // Afficher un message d'erreur
      }
    });
  }
}
