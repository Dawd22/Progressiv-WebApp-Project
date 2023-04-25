import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {
    
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }

  isUserLoggedIn() {
    return this.auth.user;
  }
  getCurrentUserEmail(): Observable<string | null> {
    return this.auth.authState.pipe(map((user) => user?.email || null));
  }
}
