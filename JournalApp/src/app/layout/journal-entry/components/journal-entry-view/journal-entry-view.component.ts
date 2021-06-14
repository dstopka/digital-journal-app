import { Component, Input, OnInit } from '@angular/core';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { JournalEntry } from 'src/app/shared/models/journal-entry/journalEntry';

@Component({
  selector: 'app-journal-entry-view',
  templateUrl: './journal-entry-view.component.html',
  styleUrls: ['./journal-entry-view.component.scss']
})
export class JournalEntryViewComponent implements OnInit {
  @Input() content!: string;
  @Input() date: Date | null = null;
  
  constructor() {}

  ngOnInit(): void {
  
  }
}
