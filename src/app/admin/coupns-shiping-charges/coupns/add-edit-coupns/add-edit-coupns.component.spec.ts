import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCoupnsComponent } from './add-edit-coupns.component';

describe('AddEditCoupnsComponent', () => {
  let component: AddEditCoupnsComponent;
  let fixture: ComponentFixture<AddEditCoupnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCoupnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCoupnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
