import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTransferListComponent } from './bill-transfer-list.component';

describe('BillTransferListComponent', () => {
  let component: BillTransferListComponent;
  let fixture: ComponentFixture<BillTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
