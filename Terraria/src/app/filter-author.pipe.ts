import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAuthor',
})
export class FilterAuthorPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter((it) => {
      return it.user.username.toLocaleLowerCase().includes(searchText);
    });
  }
}
