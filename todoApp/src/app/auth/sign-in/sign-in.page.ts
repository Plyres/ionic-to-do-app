import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Registration successful. Please log in.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigateByUrl('/home');
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'error',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}