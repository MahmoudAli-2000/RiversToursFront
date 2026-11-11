import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(objectList:any[],filterText:string): any[] {

    return objectList.filter((item)=>item.referneceName.toLowerCase().includes(filterText.toLowerCase())); 

  }

}
