import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.email);
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {}

  async login() {
    const email = this.email.value || '';
    const password = this.password.value|| '';
    if(!email ||!password){
      console.error('Email vagy a jelszó üres');
    }
    this.authService
      .login(email, password)
      .then((cred) => {
        console.log(cred);
        this.router.navigateByUrl('/main');
      })
      .catch((error) => {
        alert("Nem megfelelő email vagy jelszó!")
        console.error(error);
      });
  }
}
