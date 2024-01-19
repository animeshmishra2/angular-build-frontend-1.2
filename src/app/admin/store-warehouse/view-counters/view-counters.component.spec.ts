import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCountersComponent } from './view-counters.component';

describe('ViewCountersComponent', () => {
  let component: ViewCountersComponent;
  let fixture: ComponentFixture<ViewCountersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCountersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
