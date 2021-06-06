import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { QuillModule } from 'ngx-quill';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DashboardComponent } from './dashboard.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { JournalEntryModalComponent } from './components/jounal-entry-modal/journal-entry-modal.component';
import { JournalEntryModule } from '../journal-entry/journal-entry.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ClickOutsideModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    QuillModule,
    ReactiveFormsModule,
    JournalEntryModule
  ],
  declarations: [
    DashboardComponent,
    CalendarComponent,
    JournalEntryModalComponent
  ],
  exports: [
    DashboardComponent,
    CalendarComponent,
    JournalEntryModalComponent
  ]
})
export class DashboardModule { }
