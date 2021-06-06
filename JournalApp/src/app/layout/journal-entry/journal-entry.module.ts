import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { JournalEntryComponent } from './journal-entry.component';
import { JournalEntryEditorComponent } from './components/journal-entry-editor/journal-entry-editor.component';
import { JournalEntryViewComponent } from './components/journal-entry-view/journal-entry-view.component';



@NgModule({
  imports: [
    CommonModule,
    QuillModule,
    ReactiveFormsModule
  ], 
  declarations: [
    JournalEntryComponent,
    JournalEntryEditorComponent,
    JournalEntryViewComponent
  ],
  exports: [
    JournalEntryComponent,
    JournalEntryViewComponent
  ]
})
export class JournalEntryModule { }
