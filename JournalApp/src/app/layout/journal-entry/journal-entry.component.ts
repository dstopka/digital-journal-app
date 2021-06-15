import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isThisISOWeek } from 'date-fns';
import moment from 'moment';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { JournalEntryEditorComponent } from './components/journal-entry-editor/journal-entry-editor.component';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent implements OnInit {
  public date: Date | null = null;
  public openEditor!: boolean;
  public entryText!: string;
  public isImportant: boolean = false;
  private entryExists!: boolean;
  @ViewChild(JournalEntryEditorComponent) editorComponent!: JournalEntryEditorComponent;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute,
    private _journalEntryService: JournalEntryService) { }

  async ngOnInit(): Promise<void> {
    this._activatedRoute.queryParams.subscribe(params => {
      const date = params['date'];
      if (date == null || date == undefined || !moment(date, "DD-MM-YYYY", true).isValid()) {
        this._router.navigate(['404']);
      }
      this.date = moment(date, "DD-MM-YYYY", true).toDate();

      const openEditor = params['editor'];
      this.openEditor = openEditor ? openEditor.toLocaleLowerCase() === 'true' : false;
    })

    if (this.date != null)
    {
      let entry = await this._journalEntryService.getEntry(this._journalEntryService.stringifyDate(this.date)); 
      if (entry == null) {
        this.entryExists = false;
        this.entryText = '';
      } else {
        this.entryExists = true;
        this.entryText = entry.entryText;
        this.isImportant = entry.isImportant;
      }
    }
  }

  public submit = () => {
    this.editorComponent.submit(this.entryExists);
  }

  public edit = () => {
    this._router.navigate([], {queryParams: {editor: 'true'}, queryParamsHandling: 'merge'})
  }

  public cancel = () => {
    if (!this.entryExists) {
      this._router.navigateByUrl('/dashboard');
    } else {
      this._router.navigate([], {queryParams: {editor: null}, queryParamsHandling: 'merge'})
    }
  }
}