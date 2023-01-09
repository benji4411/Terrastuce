import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTipComponent } from './new-tip.component';

describe('NewTipComponent', () => {
  let component: NewTipComponent;
  let fixture: ComponentFixture<NewTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
