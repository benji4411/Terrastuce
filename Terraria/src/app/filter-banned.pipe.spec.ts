import { FilterBannedPipe } from './filter-banned.pipe';

describe('FilterBannedPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterBannedPipe();
    expect(pipe).toBeTruthy();
  });
});
