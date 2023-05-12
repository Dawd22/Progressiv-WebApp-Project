import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexDbService {
  private db: IDBDatabase | undefined;

  constructor() {
    const request = indexedDB.open('todo_db', 2);
    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      
    };

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.db.createObjectStore('todos', { keyPath: 'id' });
    };
  }

  addTodos(todos$: Observable<Todo[]>, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      todos$.pipe(
        map(todos => todos.filter(todo => todo.user_email === email))
      ).subscribe(filteredTodos => {
        const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
        const store = transaction.objectStore('todos');
        filteredTodos.forEach(todo => store.add(todo));
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

    const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    console.log("alma")

    const request = store.getAll();
    return new Observable(observer => {
      request.onsuccess = (event) => {
        observer.next(request.result as Todo[]);
        observer.complete();
      };
  
      request.onerror = (event) => {
        console.error('IndexedDB getAllTodos error:', (event.target as IDBOpenDBRequest).error);
        observer.error((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  updateTodo(todo: Todo) {
    const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');

    store.put(todo);
  }

  deleteTodo(todo: Todo) {
    const transaction = (this.db as IDBDatabase).transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');

    store.delete(todo.id);
  }

}
