import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBranchCategoryComponent } from './package-branch-category.component';

describe('PackageBranchCategoryComponent', () => {
  let component: PackageBranchCategoryComponent;
  let fixture: ComponentFixture<PackageBranchCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageBranchCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBranchCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
