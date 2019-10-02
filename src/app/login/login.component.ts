import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validatingForm: FormGroup;

  constructor(
    public router: Router,
    private srvLogin: LoginService) { }

  ngOnInit() {
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
     const username = this.validatingForm.get('username').value;
     const password = this.validatingForm.get('password').value;
     this.srvLogin.login(username, password)
       .then((response: any) => {
         localStorage.setItem('userInfo', JSON.stringify(response.body.info));
         localStorage.setItem('authToken', response.headers.get('x-auth-token'));

         this.router.navigate(['/scan-request']);
       })
       .catch((error) => {
         // TODO: Show the error notification
         //if error status = 401
         console.log(JSON.stringify(error.status));
       });


   }
  }


