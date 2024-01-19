import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginDetailsDialogComponent } from './margin-details-dialog.component';

describe('MarginDetailsDialogComponent', () => {
  let component: MarginDetailsDialogComponent;
  let fixture: ComponentFixture<MarginDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarginDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
