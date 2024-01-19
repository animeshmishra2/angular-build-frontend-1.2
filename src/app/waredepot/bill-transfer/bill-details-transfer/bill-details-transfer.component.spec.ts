import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailsTransferComponent } from './bill-details-transfer.component';

describe('BillDetailsTransferComponent', () => {
  let component: BillDetailsTransferComponent;
  let fixture: ComponentFixture<BillDetailsTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDetailsTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDetailsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
