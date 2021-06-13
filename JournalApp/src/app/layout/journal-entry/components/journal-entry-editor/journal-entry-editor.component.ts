import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { journal } from 'src/app/shared/models/journal-entry/journal';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-journal-entry-editor',
  templateUrl: './journal-entry-editor.component.html',
  styleUrls: ['./journal-entry-editor.component.scss']
})
export class JournalEntryEditorComponent implements OnInit {
  quillConfiguration = QuillConfiguration;
  public errorMessage: string = "";
  public showError!: boolean;
  @Input() entryJournalControl!: FormControl;
  @Input() date: Date | null = null;

  constructor(private _journalEntryService: JournalEntryService,
              private _authService: AuthenticationService,
              private _router: Router) { }

  ngOnInit(): void {
    this.entryJournalControl = this.entryJournalControl ?? new FormControl('');
    this.entryJournalControl.setValue("Lorem ipsum");
  }

  public submit = () => {
    this.showError = false;
    const journal: journal = {
      journalText: this.entryJournalControl.value,
      userId: this._authService.getUserId()!,
      date: this._journalEntryService.stringifyDate(this.date!),
      isImportant: false
    };

    this._journalEntryService.saveJournal(journal)
        .subscribe(_ => {
          this._router.navigate(["/entry", {date: journal.date, userId: journal.userId}])
        },
        error => {
          this.errorMessage = error;
          this.showError = true;
          console.log("ERROR: " + error);
        })

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
