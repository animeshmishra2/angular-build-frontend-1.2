import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryValueReportComponent } from './inventory-value-report.component';

describe('InventoryValueReportComponent', () => {
  let component: InventoryValueReportComponent;
  let fixture: ComponentFixture<InventoryValueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryValueReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryValueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
