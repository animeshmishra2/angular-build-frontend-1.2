import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreshouldPurchaseOrderComponent } from './threshould-purchase-order.component';

describe('ThreshouldPurchaseOrderComponent', () => {
  let component: ThreshouldPurchaseOrderComponent;
  let fixture: ComponentFixture<ThreshouldPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreshouldPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreshouldPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
