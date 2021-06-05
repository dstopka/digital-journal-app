import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  { 
    path: '', 
    component: LayoutComponent, 
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      { path: 'entry', component: JournalEntryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
