import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCloseCounterComponent } from './open-close-counter.component';

describe('OpenCloseCounterComponent', () => {
  let component: OpenCloseCounterComponent;
  let fixture: ComponentFixture<OpenCloseCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenCloseCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCloseCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
