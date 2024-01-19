import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderToWarehouseComponent } from './order-to-warehouse.component';

describe('OrderToWarehouseComponent', () => {
  let component: OrderToWarehouseComponent;
  let fixture: ComponentFixture<OrderToWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderToWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderToWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
