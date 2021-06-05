import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { JournalEntryComponent } from './journal-entry.component';
import { JournalEntryEditorComponent } from './components/journal-entry-editor/journal-entry-editor.component';



@NgModule({
  imports: [
    CommonModule,
    QuillModule,
    ReactiveFormsModule
  ], 
  declarations: [
    JournalEntryComponent,
    JournalEntryEditorComponent
  ],
  exports: [
    JournalEntryComponent
  ]
})
export class JournalEntryModule { }
