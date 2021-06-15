import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { EntryInfoDto } from 'src/app/shared/models/journal-entry/entryInfoDto';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import moment from 'moment';

interface JournalEntryEvent extends CalendarEvent {
  isImportant: boolean;
}

@Component({
  selector: 'dashboard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public view: CalendarView = CalendarView.Month;
  public viewDate!: Date;
  public previousYearDate!: Date;
  public nextYearDate!: Date;
  public journalEntryEvents: JournalEntryEvent[] = [];
  public refresh: Subject<any> = new Subject();

  constructor(private _journalEntryService: JournalEntryService, private _router: Router) {
    this.resetDate();
  }

  async ngOnInit(): Promise<void> {
    let entryInfos = await this._journalEntryService.getEntriesInfo();
    this.parseJournalEntries(entryInfos);
  }

  public dayClicked = ({ date, events }: { date: Date; events: CalendarEvent[] }): void => {    
      const dateString = this._journalEntryService.stringifyDate(date);

      if (!events.length) {
        this._router.navigate(['/entry'], {queryParams: {date: dateString, editor: true}});
      } else {
        this._router.navigate(['/dashboard', {outlets: {modal: 'entry'}}], {queryParams: {date: dateString}});
      }
  }

  public isImportant = (events: JournalEntryEvent[]): boolean => {
    return events.some(e => e.isImportant);
  }

  private parseJournalEntries = (entryInfos: EntryInfoDto[]): void => {
    entryInfos.forEach(entry => {
      const entryDate = moment(entry.date, "DD-MM-YYYY", true).toDate();
      this.journalEntryEvents.push({
        start: entryDate,
        title: entry.date,
        isImportant: entry.isImportant
      })
    });
    this.refresh.next();
  }

  public rewindYear = (): void => {
    this.nextYearDate = this.viewDate;
    this.viewDate = this.changeYear(this.viewDate, -1);
    this.previousYearDate = this.changeYear(this.viewDate, -1);
  }

  public forwardYear = (): void => {
    this.previousYearDate = this.viewDate;
    this.viewDate =  this.changeYear(this.viewDate, 1);
    this.nextYearDate = this.changeYear(this.viewDate, 1);
  }

  private changeYear = (date: Date, n: number): Date => {
    const m = date.getMonth();
    const d = date.getDate();
    const y = date.getFullYear();

    return new Date(y + n, m, d);
  }

  public resetDate = (): void => {
    this.viewDate = new Date();
    this.nextYearDate = this.changeYear(this.viewDate, 1);
    this.previousYearDate = this.changeYear(this.viewDate, -1);
  }
}
