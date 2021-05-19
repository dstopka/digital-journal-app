import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { entryInfoDto } from 'src/app/shared/models/journal-entry/entryInfoDto';

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

  constructor(private _journalEntryService: JournalEntryService) { }

  ngOnInit(): void {
    this.parseJournalEntries(this._journalEntryService.getEntriesInfo());
  }

  public dayClicked = ({ date, events }: { date: Date; events: CalendarEvent[] }): void => {
    console.log(this.stringifyDate(date));
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
      this.journalEntryEvents.push({
        start: entry.date,
        title: this.stringifyDate(entry.date),
        isImportant: entry.isImportant
      })
    });
  }
}
