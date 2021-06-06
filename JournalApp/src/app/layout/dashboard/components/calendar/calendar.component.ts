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

  private parseJournalEntries = (entryInfos: entryInfoDto[]): void => {
    entryInfos.forEach(entry => {
      entry.date = new Date(entry.date);
      this.journalEntryEvents.push({
        start: entry.date,
        title: this._journalEntryService.stringifyDate(entry.date),
        isImportant: entry.isImportant
      })
    });
    this.refresh.next();
  }
}
