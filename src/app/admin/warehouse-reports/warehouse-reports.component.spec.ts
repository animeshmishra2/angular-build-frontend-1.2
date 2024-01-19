import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReportsComponent } from './warehouse-reports.component';

describe('WarehouseReportsComponent', () => {
  let component: WarehouseReportsComponent;
  let fixture: ComponentFixture<WarehouseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
