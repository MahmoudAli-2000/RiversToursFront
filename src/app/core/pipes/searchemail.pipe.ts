import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchemail',
  standalone: true
})
export class SearchemailPipe implements PipeTransform {

  transform(objectList:any[],filterText:string): any[] {

    if (!objectList || !filterText) return objectList;

    const term = filterText.toLowerCase();

    return objectList.filter(item =>
      item.emailAddress?.toLowerCase().includes(term) ||
      item.fullName?.toLowerCase().includes(term)
    );
  }

  }

