import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementRequestComponent } from './requirement-request.component';

describe('RequirementRequestComponent', () => {
  let component: RequirementRequestComponent;
  let fixture: ComponentFixture<RequirementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
