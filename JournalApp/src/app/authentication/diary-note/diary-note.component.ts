import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-diary-note',
  templateUrl: './diary-note.component.html',
  styleUrls: ['./diary-note.component.scss', '../authentication.scss']
})
export class DiaryNoteComponent implements OnInit {
  public errorMessage: string = '';
  public showError!: boolean;
  public diaryNoteForm!: FormGroup;

  constructor(private _router: Router, private _activeModal: NgbActiveModal) { }
  quillConfiguration = QuillConfiguration
  @Input()
  control: FormControl = new FormControl;

  ngOnInit(): void {
    this.control = this.control ?? new FormControl()
  }

  public closeRoute = (route: string) => {
    this.close();
    this._router.navigate([route])
  }
  
  private close = () => {
    this._activeModal.close();
  }
}

export const QuillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{color: []}, {background: []}],
    ['link'],
    ['clean'],
  ],
}

