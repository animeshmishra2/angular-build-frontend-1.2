import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptSwOrderComponent } from './accept-sw-order.component';

describe('AcceptSwOrderComponent', () => {
  let component: AcceptSwOrderComponent;
  let fixture: ComponentFixture<AcceptSwOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptSwOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptSwOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
