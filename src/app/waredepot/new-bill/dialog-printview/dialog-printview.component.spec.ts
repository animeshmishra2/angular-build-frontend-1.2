import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPrintviewComponent } from './dialog-printview.component';

describe('DialogPrintviewComponent', () => {
  let component: DialogPrintviewComponent;
  let fixture: ComponentFixture<DialogPrintviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPrintviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPrintviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
