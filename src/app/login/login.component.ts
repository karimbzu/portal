import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validatingForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.validatingForm = new FormGroup({
      required: new FormControl(null, Validators.required)
    });
  }

  get input() { return this.validatingForm.get('required'); }
  }


