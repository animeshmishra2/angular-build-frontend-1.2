import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReplacementReportComponent } from './stock-replacement-report.component';

describe('StockReplacementReportComponent', () => {
  let component: StockReplacementReportComponent;
  let fixture: ComponentFixture<StockReplacementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReplacementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReplacementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
