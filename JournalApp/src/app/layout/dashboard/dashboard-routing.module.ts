import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalEntryModalComponent } from './components/jounal-entry-modal/journal-entry-modal.component';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    children: [
      { path: 'entry', outlet: 'modal', component: JournalEntryModalComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
