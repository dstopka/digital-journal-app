import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { JournalEntryEditorComponent } from './components/journal-entry-editor/journal-entry-editor.component';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent implements OnInit {
  public date: Date | null = null;
  @ViewChild(JournalEntryEditorComponent) editorComponent!: JournalEntryEditorComponent;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const date = params['date'];
      if (date == null || date == undefined || !moment(date, "DD-MM-YYYY", true).isValid()) {
        this._router.navigate(['404']);
      }
      this.date = moment(date, "DD-MM-YYYY", true).toDate();
    })
  }

  public submit = () => {
    this.editorComponent.submit();
  }
}