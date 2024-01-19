import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPendencyComponent } from './total-pendency.component';

describe('TotalPendencyComponent', () => {
  let component: TotalPendencyComponent;
  let fixture: ComponentFixture<TotalPendencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalPendencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalPendencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
