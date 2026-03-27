import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoanCalculatorComponent } from './loan-calculator.component';

const routes: Routes = [
  { path: '', component: LoanCalculatorComponent }
];

@NgModule({
  declarations: [LoanCalculatorComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LoanCalculatorModule { }
