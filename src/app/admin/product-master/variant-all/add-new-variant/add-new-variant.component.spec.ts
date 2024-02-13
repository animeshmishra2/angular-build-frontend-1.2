import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewVariantComponent } from './add-new-variant.component';

describe('AddNewVariantComponent', () => {
  let component: AddNewVariantComponent;
  let fixture: ComponentFixture<AddNewVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
