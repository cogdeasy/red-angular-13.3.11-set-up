import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoanStatusComponent } from './loan-status.component';

const routes: Routes = [
  { path: '', component: LoanStatusComponent }
];

@NgModule({
  declarations: [LoanStatusComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LoanStatusModule { }
