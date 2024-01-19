import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPurchaseReportComponent } from './total-purchase-report.component';

describe('TotalPurchaseReportComponent', () => {
  let component: TotalPurchaseReportComponent;
  let fixture: ComponentFixture<TotalPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalPurchaseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
