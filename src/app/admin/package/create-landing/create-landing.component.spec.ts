import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLandingComponent } from './create-landing.component';

describe('CreateLandingComponent', () => {
  let component: CreateLandingComponent;
  let fixture: ComponentFixture<CreateLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
