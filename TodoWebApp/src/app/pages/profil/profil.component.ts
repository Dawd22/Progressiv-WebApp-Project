import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Todo } from 'src/app/shared/models/todo';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TodoService } from 'src/app/shared/services/todo.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { IndexDbService } from 'src/app/shared/services/index-db.service';


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
  private initialTodoData: Todo = {
    id: '1',
    title: 'Bevásárlás',
    description: 'Menni a boltba és venni egy csomag tejet',
    completed: false,
    user_email: 'teszt@teszt.com',
    deadline: new Timestamp(1000, 100),
  };
  private userEmail: Observable<string | null>;
  public add = false;
  public setting = false;
  public todos: Observable<Todo[]>;
  public todos$: Observable<Todo[]>;
  public todo$: Todo = this.initialTodoData;
  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    private indexedDBService: IndexDbService
  ) {
  
    const todo: Todo = {
      id: '',
      title: 'title',
      description: ' description',
      completed: false,
      user_email: '',
      deadline: new Timestamp(new Date().getTime() / 1000, 0),
    };
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
      this.indexedDBService.addTodos(this.todos$, email || '').then(() =>{
            console.log("Hozzá lett adva!");
          }).catch(()=>{
            console.log("Vmi hiba van!");
          });
        emailSub.unsubscribe();
      });  

    this.todos$ = this.indexedDBService.getAllTodos();
    
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
        const date = new Date(deadline);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        const todo: Todo = {
          id: '',
          title: title,
          description: description,
          completed: false,
          user_email: email?.toString() || '',
          deadline: new Timestamp(date.getTime() / 1000, 0),
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
  changeSettingTodo(id: string): void {
    this.setting = !this.setting;
    const sub = this.todoService.getById(id).subscribe((todo) => {
      if (todo) {
        this.todo$ = todo;
        sub.unsubscribe();
      }
    });
  }
  changeCompletedTodo(id: string): void {
    const sub = this.todoService.getById(id).subscribe((todo) => {
      if (todo) {
        const com = !todo.completed;
        todo.completed = com;
        this.todoService.update(todo);
        sub.unsubscribe();
      }
    });
  }
  saveTodoSetting(): void {
    this.todoService
      .update(this.todo$)
      .then(() => {
        alert('Sikeres frissítés');
        this.changeSettingTodo(this.todo$.id);
      })
      .catch(() => {
        alert('Hiba történt frissítés során!');
      });
  }
  deleteTodo(id: string): void {
    this.todoService
      .delete(id)
      .then(() => {
        alert('Sikeres törlés!');
      })
      .catch(() => {
        alert('Hiba történt!');
      });
  }
}
