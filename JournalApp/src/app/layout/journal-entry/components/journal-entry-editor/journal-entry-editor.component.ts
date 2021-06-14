import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalEntry } from 'src/app/shared/models/journal-entry/journalEntry';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-journal-entry-editor',
  templateUrl: './journal-entry-editor.component.html',
  styleUrls: ['./journal-entry-editor.component.scss']
})
export class JournalEntryEditorComponent implements OnInit {
  private _text = new BehaviorSubject<string>('');
  public quillConfiguration = QuillConfiguration;
  public errorMessage: string = "";
  public showError!: boolean;
  public journalEntryControl!: FormControl;
  @Input() date: Date | null = null;
  @Input() set entryText(text: string) {
    this._text.next(text);
  }

  constructor(private _journalEntryService: JournalEntryService,
              private _authService: AuthenticationService,
              private _router: Router) { }

  ngOnInit(): void {
    this._text.subscribe(text => {
      this.journalEntryControl = new FormControl(text);
    })    
  }

  public submit = (update: boolean) => {
    this.showError = false;
    const stringDate = this._journalEntryService.stringifyDate(this.date!);

    const journal: JournalEntry = {
      entryText: this.journalEntryControl.value,
      userId: Number(this._authService.getUserId()!),
      date: stringDate,
      isImportant: false
    };

    if (update) {
      this._journalEntryService.updateEntry(journal)
      .subscribe(_ => {
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this._router.navigate(['/entry'], {queryParams: {date: stringDate, editor: false}}));
      },
      error => {
        this.errorMessage = error;
        this.showError = true;
        console.log("ERROR: " + error);
      })
    } else {
      this._journalEntryService.saveEntry(journal)
      .subscribe(_ => {
        this._router.navigate(['/entry'], {queryParams: {date: stringDate, editor: false}});
      },
      error => {
        this.errorMessage = error;
        this.showError = true;
        console.log("ERROR: " + error);
      })
    }
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
