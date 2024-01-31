import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsReportComponent } from './order-details-report.component';

describe('OrderDetailsReportComponent', () => {
  let component: OrderDetailsReportComponent;
  let fixture: ComponentFixture<OrderDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
