import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { LayoutComponent } from './layout.component';
import { CalendarComponent } from './dashboard/components/calendar/calendar.component';
import { JournalComponent } from './dashboard/components/journal/journal.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    QuillModule,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    MenuComponent,
    LayoutComponent,
    CalendarComponent,
    JournalComponent
  ],
  exports: [
    DashboardComponent,
    MenuComponent
  ],
})
export class LayoutModule { }
