import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({ 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
   
  ngOnInit(): void {
  } 
/**
 *
 */
  constructor(public authService: AuthService) { 
  }

  onLogin(form: NgForm) { 
    if(form.invalid)
      return;
    this.authService.loginUser(form.value.email, form.value.password);
  } 
}
