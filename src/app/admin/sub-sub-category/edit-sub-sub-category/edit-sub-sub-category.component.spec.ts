import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubSubCategoryComponent } from './edit-sub-sub-category.component';

describe('EditSubSubCategoryComponent', () => {
  let component: EditSubSubCategoryComponent;
  let fixture: ComponentFixture<EditSubSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
