import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {JournalComponent} from './components/journal/journal.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dialog!: NgbModalRef

  constructor(private _modalService: NgbModal, private _router: Router) {
    this.createModal();
  }

  ngOnInit(): void {
  }

  private createModal = () => {
    const url = this._router.url;

    if (url == '/dashboard/journal') {
      this.dialog = this._modalService.open(JournalComponent, { centered: true, animation: true })
    }

    if (this.dialog != null) {
      this.dialog.result.then(() => {
      }, (reason) => {
        this._router.navigateByUrl('/dashboard');
      });
    }
  }
}
