import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CogsReportComponent } from './cogs-report.component';

describe('CogsReportComponent', () => {
  let component: CogsReportComponent;
  let fixture: ComponentFixture<CogsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CogsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CogsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
