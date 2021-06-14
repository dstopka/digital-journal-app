import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { JournalEntryService } from 'src/app/shared/services/journal-entry.service';

@Component({
  selector: 'app-journal-entry-modal',
  templateUrl: './journal-entry-modal.component.html',
  styleUrls: ['./journal-entry-modal.component.scss']
})
export class JournalEntryModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  public date!: Date;
  public entryText!: string;
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modalBackdrop') modalBackdrop!: ElementRef;

  constructor(private _router: Router, private _renderer: Renderer2,
    private _activatedRoute: ActivatedRoute, private _journalEntryService: JournalEntryService) {
    this._activatedRoute.queryParams.subscribe(params => {
      const date = params['date'];
      if (date == null || date == undefined || !moment(date, "DD-MM-YYYY", true).isValid()) {
        this._router.navigate(['404']);
      }
      this.date = moment(date, "DD-MM-YYYY", true).toDate();
    })
  }

  async ngOnInit(): Promise<void> {
    this._renderer.addClass(document.body, 'modal-open');

    if (this.date != null)
    {
      let entry = await this._journalEntryService.getEntry(this._journalEntryService.stringifyDate(this.date)); 
      this.entryText = entry.entryText;
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._renderer.addClass(this.modal['nativeElement'], 'show');
      this._renderer.addClass(this.modalBackdrop['nativeElement'], 'show');
    }, 200);
  }

  ngOnDestroy(): void {
    this._renderer.removeClass(document.body, 'modal-open');
  }

  public close = (): void => {
    this._renderer.removeClass(this.modal['nativeElement'], 'show');
    this._renderer.removeClass(this.modalBackdrop['nativeElement'], 'show');
    this._router.navigate([{ outlets: { modal: null } }], { relativeTo: this._activatedRoute.parent });
  }

  public onClickedOutside = (): void => {
    this.close();
  }

  public goEntryEditor = (): void => {
    this.goEntry(true);
  }

  public goEntryView = (): void => {
    this.goEntry(false);
  }

  private goEntry = (openEditor: boolean): void => {
    const query = { date: this._journalEntryService.stringifyDate(this.date), editor: openEditor };
    this._router.navigate(['/entry'], {queryParams: query});
  }
}