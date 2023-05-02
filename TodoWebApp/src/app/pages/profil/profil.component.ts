import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Todo } from 'src/app/shared/models/todo';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TodoService } from 'src/app/shared/services/todo.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  todoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    deadline: new FormControl('', Validators.required),
  });

  private userEmail: Observable<string | null>;
  public add = false;
  public todos: Observable<Todo[]>;
  public todos$: Observable<Todo[]>;
  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.todos = this.todoService.getAll();
    this.todos$ = this.todoService.getAll();
    this.userEmail = this.authService.getCurrentUserEmail();
  }

  ngOnInit(): void {
    const emailSub = this.userEmail.subscribe((email) => {
      this.todos = this.todoService.getTodosByUserEmail(email || '');
      this.todos
        .pipe(
          map((todo) =>
            todo.sort(
              (a, b) =>
                a.deadline.toDate().getTime() - b.deadline.toDate().getTime()
            )
          )
        )
        .subscribe((sorted) => {
          this.todos$ = of(sorted);
        });
      emailSub.unsubscribe();
    });
  }

  onSubmit() {
    const title = this.todoForm.get('title')?.value || '';
    const description = this.todoForm.get('description')?.value || '';
    const deadline = this.todoForm.get('deadline')?.value || '';
    const userEmailSubscription = this.userEmail.subscribe((email) => {
      if (email == '') {
        alert('Csak bejelentkezett felhasználók használhatják');
        userEmailSubscription.unsubscribe();
        this.router.navigate(['/login']);
      } else if (deadline == '' || title == '' || description == '') {
        alert('Tölts ki minden mezőt');
        userEmailSubscription.unsubscribe();
      } else {
        const todo: Todo = {
          id: '',
          title: title,
          description: description,
          completed: false,
          user_email: email?.toString() || '',
          deadline: new Timestamp(new Date(deadline).getTime() / 1000, 0),
        };

        if (!(todo.deadline.toDate() < new Date())) {
          todo.id = this.afs.createId();
          this.todoService
            .create(todo)
            .then((_) => {
              alert('Sikeres hozzáadás');
              this.changeAddTodo();
              userEmailSubscription.unsubscribe();
            })
            .catch((error) => {
              alert('Hiba történt a hozzáadás során!');
              console.log(error);
              userEmailSubscription.unsubscribe();
            });
        } else {
          alert('A dátum nem lehet kisebb, mint a mai nap!');
          userEmailSubscription.unsubscribe();
        }
      }
    });
  }
  changeAddTodo(): void {
    this.add = !this.add;
  }
}
