import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBranchComponent } from './package-branch.component';

describe('PackageBranchComponent', () => {
  let component: PackageBranchComponent;
  let fixture: ComponentFixture<PackageBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
