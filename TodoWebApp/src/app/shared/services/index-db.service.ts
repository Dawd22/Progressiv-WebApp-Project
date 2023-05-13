import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, from, map, switchMap } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class IndexDbService {
  private db: IDBDatabase | undefined;
  private dbReady: Promise<void>;
  constructor() {
    this.dbReady = new Promise((resolve, reject) => {
      const request = indexedDB.open('todo_db', 2);
      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.db.createObjectStore('todos', { keyPath: 'id' });
      };
    });
  }

  addTodos(todos$: Observable<Todo[]>, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      todos$.pipe(
        map(todos => todos.filter(todo => todo.user_email === email))
      ).subscribe(filteredTodos => {
        const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
        const store = transaction.objectStore('todos');
        filteredTodos.forEach(todo => {
          todo.deadline = new Timestamp (todo.deadline.toDate().getTime()/1000,0);
          store.add(todo);});
        transaction.oncomplete = () => {
          resolve(); 
        };
        transaction.onerror = (event) => {
          reject((event.target as IDBOpenDBRequest).error); 
        };
      });
    });
  }

  getAllTodos(): Observable<Todo[]> {

    return from(this.dbReady).pipe(
      switchMap(() => {
        const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readonly');
        const store = transaction.objectStore('todos');
        const request = store.getAll();
        return new Observable<Todo[]>(observer => {
          request.onsuccess = (event) => {
            observer.next(request.result as Todo[]);
            observer.complete();
          };
          request.onerror = (event) => {
            console.error('IndexedDB getAllTodos error:', (event.target as IDBOpenDBRequest).error);
            observer.error((event.target as IDBOpenDBRequest).error);
          };
        });
      })
    );
  }


  updateTodo(todo: Todo) {
    const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');

    store.put(todo);
  }

  deleteTodo(id:string) {
    const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');

    store.delete(id);
  }

}
