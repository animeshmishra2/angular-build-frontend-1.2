import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDrawerTransactionComponent } from './cash-drawer-transaction.component';

describe('CashDrawerTransactionComponent', () => {
  let component: CashDrawerTransactionComponent;
  let fixture: ComponentFixture<CashDrawerTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDrawerTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashDrawerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
