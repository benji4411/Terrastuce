import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterId',
})
export class FilterIdPipe implements PipeTransform {
  transform(items: any[], searchId: number | undefined): any[] {
    if (!items) {
      return [];
    }
    if (!searchId || searchId === undefined) {
      return items;
    }

    return items.filter((it) => {
      return (it.id + '').includes(searchId + '');
    });
  }
}
