import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShippingChargesComponent } from './add-edit-shipping-charges.component';

describe('AddEditShippingChargesComponent', () => {
  let component: AddEditShippingChargesComponent;
  let fixture: ComponentFixture<AddEditShippingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShippingChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShippingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
