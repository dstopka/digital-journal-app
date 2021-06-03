import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-journal-entry-modal',
  templateUrl: './journal-entry-modal.component.html',
  styleUrls: ['./journal-entry-modal.component.scss']
})
export class JournalEntryModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  quillConfiguration = QuillConfiguration;
  @Input() entryControl: FormControl = new FormControl;
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modalBackdrop') modalBackdrop!: ElementRef;

  constructor(private _router: Router, private _renderer: Renderer2,
              private _activatedRoute: ActivatedRoute) { }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._renderer.addClass(this.modal['nativeElement'], 'show');
      this._renderer.addClass(this.modalBackdrop['nativeElement'], 'show');
    }, 200);
  }

  ngOnInit(): void {
    this.entryControl = this.entryControl ?? new FormControl();
    this._renderer.addClass(document.body, 'modal-open');
  }

  ngOnDestroy(): void {
    this._renderer.removeClass(document.body, 'modal-open');
  }

  public submit = () => {
    console.log(this.entryControl.value);
    let regex = /<img.*?src="(.*?)">/g;
    let matches = [...this.entryControl.value.matchAll(regex)];
    matches.forEach((element: any) => {
      console.log(element[1]);
    });
  }

  public close = () => {
    this._renderer.removeClass(this.modal['nativeElement'], 'show');
    this._renderer.removeClass(this.modalBackdrop['nativeElement'], 'show');
    this._router.navigate([{outlets: {modal: null}}], { relativeTo: this._activatedRoute.parent });
  }

  public onClickedOutside = () => {
    this.close();
  }
}

export const QuillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
}
