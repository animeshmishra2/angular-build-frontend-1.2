import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVarientComponent } from './manage-varient.component';

describe('ManageVarientComponent', () => {
  let component: ManageVarientComponent;
  let fixture: ComponentFixture<ManageVarientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVarientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVarientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
