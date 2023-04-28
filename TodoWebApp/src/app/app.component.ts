import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TodoWebApp';
  loggedInUser?: firebase.default.User | null;
  constructor(private authService: AuthService ){}

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(
      (user) => {
        console.log(user);
        this.loggedInUser = user;
        localStorage.setItem('user',JSON.stringify(this.loggedInUser));
      },
      (error) => {
        console.error(error);
        localStorage.setItem('user', JSON.stringify('null'));
      }
    );
  }
  
  logout() {
    this.authService.logout().then(() => {
      console.log('Kijelentkeztél');
    }).catch(error =>{console.error(error);});
  }
  
  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }
  onClose(sidenav: MatSidenav) {
    sidenav.close();
  }
}
