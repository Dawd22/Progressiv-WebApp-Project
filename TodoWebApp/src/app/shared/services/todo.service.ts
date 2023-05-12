import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  collectionName = 'Todos';
  
  constructor(private afs: AngularFirestore) {}

  create(todo: Todo) {
    return this.afs
      .collection<Todo>(this.collectionName)
      .doc(todo.id)
      .set(todo);
  }

  getTodosByUserEmail(userEmail:string){
    const userTodosCollection = this.afs
    .collection<Todo>(this.collectionName, 
      ref =>{
        return ref.where('user_email','==',userEmail);
      });
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
