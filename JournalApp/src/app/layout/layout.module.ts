import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MenuComponent } from './menu/menu.component';
import { LayoutComponent } from './layout.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { JournalEntryModule } from './journal-entry/journal-entry.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    DashboardModule,
    JournalEntryModule
  ],
  declarations: [
    MenuComponent,
    LayoutComponent
  ],
  exports: [
    LayoutComponent,
    MenuComponent
  ],
})
export class LayoutModule { }
