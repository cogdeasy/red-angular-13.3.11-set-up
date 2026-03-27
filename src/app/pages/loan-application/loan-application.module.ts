import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoanApplicationComponent } from './loan-application.component';

const routes: Routes = [
  { path: '', component: LoanApplicationComponent }
];

@NgModule({
  declarations: [LoanApplicationComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LoanApplicationModule { }
