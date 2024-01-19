import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterOrdersComponent } from './counter-orders.component';

describe('CounterOrdersComponent', () => {
  let component: CounterOrdersComponent;
  let fixture: ComponentFixture<CounterOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
