import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';

import { ToastService } from 'ng-uikit-pro-standard';
// import Swal from 'sweetalert2';
// import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validatingForm: FormGroup;
  loading = false;
  marked = false;

  constructor(
    public router: Router,
    private toastrService: ToastService,
    private srvLogin: LoginService) { }

    // showWarning() {
    //   this.toastrService.warning('Error message');
    // }

  ngOnInit() {
    // If already login, proceed to dashboard
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/dashboard']);
    }

    this.validatingForm = new FormGroup({
     username: new FormControl(null, Validators.required),
     password: new FormControl(null, Validators.required)
    });
  }

  get username() {
    return this.validatingForm.get('username');
   }

   get password() {
    return this.validatingForm.get('password');
   }

   handleLogin() {
    this.loading = true;

    const username = this.validatingForm.get('username').value;
    const password = this.validatingForm.get('password').value;
    this.srvLogin.login(username, password)
      .then((response: any) => {
         localStorage.setItem('userInfo', JSON.stringify(response.body.info));
         localStorage.setItem('authToken', response.headers.get('x-auth-token'));

         this.loading = false;
         this.router.navigate(['/dashboard']);
       })
       .catch((error) => {
         if (error.status === 401) {
           this.toastrService.error('Invalid Username or Password!');
         } else {
           this.toastrService.warning('Backend Problem!');
         }

         this.loading = false;
         this.router.navigate(['/login']);
       });

   }
  }


