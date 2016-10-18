// 3d party imports
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// app imports
import { TabsPage } from '../';
import { AuthService } from '../../services';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: {
    name?: string,
    email?: string,
    password?: string
  } = {};
  submitted = false;

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private toastCtrl: ToastController,
              private storage: Storage) {
  }

  onSignup(form) {

    this.submitted = true;
    if (form.valid) {

      let data = {
        email: form.controls.email.value,
        password: form.controls.password.value
      };
      this.storage.set('registername', form.controls.name.value).then((res) => {
        this.authService.signupEmailPassword(data).then(
          (res) => {
            this.navCtrl.push(TabsPage);
          },
          (err) => {
            let toast = this.toastCtrl.create({
              message: err.message,
              showCloseButton: true,
              closeButtonText: 'close',
              duration: 5000
            });
            toast.present();
          }
        );
      });

    }
  }
}
