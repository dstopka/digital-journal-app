import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-journal-entry-view',
  templateUrl: './journal-entry-view.component.html',
  styleUrls: ['./journal-entry-view.component.scss']
})
export class JournalEntryViewComponent implements OnInit {
  public content: string;
  @Input() date: Date | null = null;
  
  constructor() { 
    this.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
                    <strong>Phasellus quis efficitur nisi. Ut sed venenatis odio.</strong> \
                    Nulla id massa a felis commodo finibus. Etiam ut ultricies mauris. \
                    Pellentesque condimentum efficitur erat, et tincidunt nisi elementum sed."
  }

  ngOnInit(): void {
  }

}
