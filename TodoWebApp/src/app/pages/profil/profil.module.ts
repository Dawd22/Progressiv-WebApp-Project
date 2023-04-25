import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { ProfilRoutingModule } from './profil-routing.module';
import { ProfilComponent } from './profil.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ]
})
export class ProfilModule { }
