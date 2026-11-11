import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findByIndex',
  standalone: true
})
export class FindByIndexPipe implements PipeTransform {
  transform(array: any[], index: number) {
    if (!array) return null;
    return array.find(item => item.index === index) || null;
  }
}
