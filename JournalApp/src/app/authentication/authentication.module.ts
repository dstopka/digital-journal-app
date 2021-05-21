import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from '../home/home.component';
import { QuillModule } from 'ngx-quill';
import { DiaryNoteComponent } from './diary-note/diary-note.component';

@NgModule({
  declarations: [
    RegisterUserComponent,
    LoginComponent,
    DiaryNoteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    RouterModule.forChild([
      { path: 'register', component: HomeComponent },
      { path: 'login', component: HomeComponent },
      { path: 'diary-note', component: HomeComponent },
    ])
  ]
})
export class AuthenticationModule { }
