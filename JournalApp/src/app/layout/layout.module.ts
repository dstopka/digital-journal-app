import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule
  ],
  declarations: [
    DashboardComponent,
    MenuComponent,
    LayoutComponent
  ],
  exports: [
    DashboardComponent,
    MenuComponent
  ],
})
export class LayoutModule { }
