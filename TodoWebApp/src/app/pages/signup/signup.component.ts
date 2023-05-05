import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.minLength(6)),
    email: new FormControl('', Validators.email),
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {}
  onSubmit(): void {
    const email = this.signupForm.get('email')?.value || '';
    const password = this.signupForm.get('password')?.value || '';
    if (!email || !password) {
      alert("Email vagy a jelszó üres!");
    }
    this.authService
      .signup(email, password)
      .then((cred) => {
        console.log(cred);
        const user: User = {
          id: cred.user?.uid as string,
          email: email,
          username: this.signupForm.get('username')?.value as string,
          type:'user'
        };
        this.userService
          .create(user)
          .then((_) => {
            console.log('Sikeres regisztráció');
          })
          .catch((error) => {
            alert("Hiba történt a regisztráció során");
            console.log(error);
          }); 
        this.router.navigateByUrl('/main');
      })
      .catch((error) => {
        alert("Nem megfelelő adatok, jelszó minimum 6 karakter hosszú!");
        console.log(error);
      });
  }
}

