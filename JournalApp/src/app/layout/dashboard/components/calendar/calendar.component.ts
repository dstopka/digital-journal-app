import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { entryInfoDto } from 'src/app/shared/models/journal-entry/entryInfoDto';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

interface JournalEntryEvent extends CalendarEvent {
  isImportant: boolean;
}

@Component({
  selector: 'dashboard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  journalEntryEvents: JournalEntryEvent[] = [];
  refresh: Subject<any> = new Subject();

  constructor(private _journalEntryService: JournalEntryService, private _router: Router) {
  }

  async ngOnInit(): Promise<void> {
    let entryInfos = await this._journalEntryService.getEntriesInfo();
    this.parseJournalEntries(entryInfos);
  }

  public dayClicked = ({ date }: { date: Date; events: CalendarEvent[] }): void => {    
      this._router.navigate(['/dashboard', {outlets: {modal: 'entry'}}], {queryParams: {date: this.stringifyDate(date)}});
  }

  private stringifyDate = (date: Date) => {
    const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
    const month = date.getMonth() < 10 ? '0' + date.getMonth().toString() : date.getMonth().toString();
    const year = date.getFullYear().toString();

    return day + '-' + month + '-' + year;
  }

  public isImportant = (events: JournalEntryEvent[]): boolean => {
    return events.some(e => e.isImportant);
  }

  private parseJournalEntries = (entryInfos: entryInfoDto[]): void => {
    entryInfos.forEach(entry => {
      entry.date = new Date(entry.date);
      this.journalEntryEvents.push({
        start: entry.date,
        title: this.stringifyDate(entry.date),
        isImportant: entry.isImportant
      })
    });
    this.refresh.next();
  }
}
