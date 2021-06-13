import { Component, Input, OnInit } from '@angular/core';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';
import { journal } from 'src/app/shared/models/journal-entry/journal';

@Component({
  selector: 'app-journal-entry-view',
  templateUrl: './journal-entry-view.component.html',
  styleUrls: ['./journal-entry-view.component.scss']
})
export class JournalEntryViewComponent implements OnInit {
  public content: string;
  @Input() date: Date | null = null;
  
  constructor(private _journalEntryService: JournalEntryService) {
    this.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
                    <strong>Phasellus quis efficitur nisi. Ut sed venenatis odio.</strong> \
                    Nulla id massa a felis commodo finibus. Etiam ut ultricies mauris. \
                    Pellentesque condimentum efficitur erat, et tincidunt nisi elementum sed."
  }

  async ngOnInit(): Promise<void> {
    if (this.date != null)
    {
      let journalText = await this._journalEntryService.getJournalText(this._journalEntryService.stringifyDate(this.date)); 
      this.parseJournalTextToContext(journalText)
    }
  }

  private parseJournalTextToContext = (journal: journal): void => {
    this.content = journal.journalText;
  }
}
