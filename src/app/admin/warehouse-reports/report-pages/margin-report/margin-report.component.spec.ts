import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginReportComponent } from './margin-report.component';

describe('MarginReportComponent', () => {
  let component: MarginReportComponent;
  let fixture: ComponentFixture<MarginReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarginReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
