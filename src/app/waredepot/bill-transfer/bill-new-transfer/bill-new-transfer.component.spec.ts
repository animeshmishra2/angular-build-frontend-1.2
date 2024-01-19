import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNewTransferComponent } from './bill-new-transfer.component';

describe('BillNewTransferComponent', () => {
  let component: BillNewTransferComponent;
  let fixture: ComponentFixture<BillNewTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillNewTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillNewTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
