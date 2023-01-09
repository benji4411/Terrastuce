import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsername',
})
export class FilterUsernamePipe implements PipeTransform {
  transform(items: any[], searchUsername: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchUsername) {
      return items;
    }
    searchUsername = searchUsername.toLocaleLowerCase();

    return items.filter((it) => {
      return it.username.toLocaleLowerCase().includes(searchUsername);
    });
  }
}
