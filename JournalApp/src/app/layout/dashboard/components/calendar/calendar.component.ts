import { Component, OnInit } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'dashboard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      title: 'A 3 day event',
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      title: 'A draggable and resizable event',
    },
  ];

  constructor() { }

  ngOnInit(): void {

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
}
