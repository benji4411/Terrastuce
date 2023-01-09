import { Pipe, PipeTransform } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Pipe({
  name: 'filterTags',
})
export class FilterTagsPipe implements PipeTransform {
  transform(items: any[], searchText: string[]): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    for (let i = 0; i < searchText.length; i++) {
      searchText[i] = searchText[i].toLowerCase();
    }

    return items.filter((it) => {
      if (it.tags){
      let isContainingAll = true;
      searchText.forEach(tag => {
        console.log(tag);
        isContainingAll = isContainingAll && it.tags.toLocaleLowerCase().includes(tag);
      });
      return isContainingAll;
    }
      return null;
    });
  }
}
