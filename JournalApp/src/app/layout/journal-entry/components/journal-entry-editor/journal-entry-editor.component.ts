import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-journal-entry-editor',
  templateUrl: './journal-entry-editor.component.html',
  styleUrls: ['./journal-entry-editor.component.scss']
})
export class JournalEntryEditorComponent implements OnInit {
  quillConfiguration = QuillConfiguration;
  @Input() entryControl: FormControl = new FormControl;
  @Input() date: Date | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  public submit = () => {
    console.log("OK");
  }

}

export const QuillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
}
