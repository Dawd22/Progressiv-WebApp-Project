import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  collectionName = 'Todos';
  constructor(private afs: AngularFirestore, private authService: AuthService) { }


  create(todo: Todo) {
    return this.afs
      .collection<Todo>(this.collectionName)
      .doc(todo.id)
      .set(todo);
  }

  getTodosByUserId(userId:string){
    const userTodosCollection = this.afs
    .collection<Todo>(this.collectionName, 
      ref =>{
        return ref.where('user_id','==',userId);
      })
      return userTodosCollection.valueChanges();
  }
  getAll() {
    return this.afs.collection<Todo>(this.collectionName).valueChanges();
  }
  getById(id: string) {
    return this.afs.collection<Todo>(this.collectionName).doc(id).valueChanges();
  }
  update(todo: Todo) {
    return this.afs
      .collection<Todo>(this.collectionName)
      .doc(todo.id)
      .set(todo);
  }
  delete(id: string) {
    return this.afs.collection<Todo>(this.collectionName).doc(id).delete();
  }

}
