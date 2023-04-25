import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TodoService } from 'src/app/shared/services/todo.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  todoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    deadline: new FormControl('', Validators.required),
  });
  constructor( private userService: UserService, private todoService: TodoService, private authService: AuthService){

  

  }

  onSubmit(){
    
  };
}
