import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPackageBrandCategoryComponent } from './add-edit-package-brand-category.component';

describe('AddEditPackageBrandCategoryComponent', () => {
  let component: AddEditPackageBrandCategoryComponent;
  let fixture: ComponentFixture<AddEditPackageBrandCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPackageBrandCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPackageBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
