import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditThresoldPurchaseOrderComponent } from './add-edit-thresold-purchase-order.component';

describe('AddEditThresoldPurchaseOrderComponent', () => {
  let component: AddEditThresoldPurchaseOrderComponent;
  let fixture: ComponentFixture<AddEditThresoldPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditThresoldPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditThresoldPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
