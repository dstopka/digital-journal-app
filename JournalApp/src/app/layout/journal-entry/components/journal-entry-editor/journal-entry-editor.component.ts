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
  @Input() entryControl!: FormControl;
  @Input() date: Date | null = null;

  constructor() { }

  ngOnInit(): void {
    this.entryControl = this.entryControl ?? new FormControl();
    this.entryControl.setValue("Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit.");
  }

  public submit = () => {
    console.log("OK");
  }

  // public submit = () => {
  //   console.log(this.entryControl.value);
  //   let regex = /<img.*?src="(.*?)">/g;
  //   let matches = [...this.entryControl.value.matchAll(regex)];
  //   matches.forEach((element: any) => {
  //     console.log(element[1]);
  //   });
  // }

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
