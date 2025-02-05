import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      birthdate: ["", Validators.required],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent form from submitting normally

    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (error) => {
          console.error("Échec de l'inscription:", error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
