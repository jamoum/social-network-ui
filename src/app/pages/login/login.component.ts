import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { FormBuilder,Validators, FormGroup } from '@angular/forms'
import { trigger,state,style } from '@angular/animations';

import {MatSnackBar} from '@angular/material/snack-bar';
import { User } from 'src/app/model/user';

export interface LoginResponse{
   access_token: string;
   user: User
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loadingState',[
      state('open',style({
         display: 'block'
      })),
      state('close',style({
        display: 'none'
      }))
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: Boolean = false;
  constructor(private router:Router,private provider:ProviderService,private formBuilder:FormBuilder,private snackbar:MatSnackBar) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }


  login() {
    this.isLoading = true;
    let body = this.loginForm.value;
    this.provider.post(API_TYPE.USER,'login',body)
    .subscribe({      
      next:(res:LoginResponse)=> {     
        res.user.password = '';
        localStorage.setItem('access_token',res.access_token)
        localStorage.setItem('active_user',JSON.stringify(res.user))
        this.router.navigateByUrl('/home')
      },
      error:(err) => {
        this.isLoading = false
        if(err.statusCode == 403) this.snackbar.open(`Invalid Username / Password`,'Ok')
        else this.snackbar.open(`${err.message}`)
      },
      complete: () => this.isLoading = false
    })
    
  }


}