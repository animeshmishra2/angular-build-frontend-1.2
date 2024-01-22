import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleiverySlotsComponent } from './deleivery-slots.component';

describe('DeleiverySlotsComponent', () => {
  let component: DeleiverySlotsComponent;
  let fixture: ComponentFixture<DeleiverySlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleiverySlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleiverySlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
