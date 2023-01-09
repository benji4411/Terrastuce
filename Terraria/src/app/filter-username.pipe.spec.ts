import { FilterUsernamePipe } from './filter-username.pipe';

describe('FilterUsernamePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterUsernamePipe();
    expect(pipe).toBeTruthy();
  });
});
