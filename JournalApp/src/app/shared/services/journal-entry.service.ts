import { Injectable } from '@angular/core';
import { entryInfoDto } from '../models/journal-entry/entryInfoDto';

import {
  startOfDay,
  subDays,
  endOfMonth,
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {

  constructor() { }

  public getEntriesInfo = () : entryInfoDto[] => {
    const entries: entryInfoDto[] = [
      {
        date: subDays(startOfDay(new Date()), 1),
        isImportant: true
      },
      {
        date: startOfDay(new Date()),
        isImportant: false
      },
      {
        date: subDays(endOfMonth(new Date()), 3),
        isImportant: true
      }
    ];

    return entries;
  }
}
