import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validatingForm: FormGroup;
  loading = false;

  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private srvLogin: LoginService) { }

  ngOnInit() {
    
     this.spinner.show();
    setTimeout(() => {
      console.log("TimeOut");
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 50000);


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
    // console.log("Spinner");
    // this.spinner.show();

     const username = this.validatingForm.get('username').value;
     const password = this.validatingForm.get('password').value;
     this.srvLogin.login(username, password)
       .then((response: any) => {
         
         localStorage.setItem('userInfo', JSON.stringify(response.body.info));
         localStorage.setItem('authToken', response.headers.get('x-auth-token'));

         this.router.navigate(['/scan-request']);
    //  this.spinner.hide();

       })
       .catch((error) => {
         // TODO: Show the error notification
         //if error status = 401
         console.log(JSON.stringify(error.status));
         console.log("Error status "+(error.status));

         if (error.status === 401) {
          Swal.fire({
             type: 'error',
             title: 'Oops...',
             text: 'Invalid Username or Password!',
          });
        } else {
          Swal.fire(
            'The backend...',
            'Something is wrong!',
            'question'
          );
        }
        // this.spinner.hide();
        this.router.navigate(['/login']);


       });


   }
  }


