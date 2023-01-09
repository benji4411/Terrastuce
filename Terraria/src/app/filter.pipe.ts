import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchtitle: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchtitle) {
      return items;
    }
    searchtitle = searchtitle.toLocaleLowerCase();

    return items.filter((it) => {
      return it.title.toLocaleLowerCase().includes(searchtitle);
    });
  }
}
