import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$', decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '-';
    }
    const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currencySymbol}${formatted}`;
  }
}
