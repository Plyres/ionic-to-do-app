import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required, Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls["email"].value;
      const password = this.loginForm.controls["password"].value;
      this.authService.login(email, password).subscribe(
        () => {
          this.router.navigateByUrl('/todo-list');
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.message || 'An error occurred during login',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}