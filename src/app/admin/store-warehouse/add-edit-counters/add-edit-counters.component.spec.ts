import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCountersComponent } from './add-edit-counters.component';

describe('AddEditCountersComponent', () => {
  let component: AddEditCountersComponent;
  let fixture: ComponentFixture<AddEditCountersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCountersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
