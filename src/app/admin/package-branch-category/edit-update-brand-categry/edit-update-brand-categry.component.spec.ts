import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUpdateBrandCategryComponent } from './edit-update-brand-categry.component';

describe('EditUpdateBrandCategryComponent', () => {
  let component: EditUpdateBrandCategryComponent;
  let fixture: ComponentFixture<EditUpdateBrandCategryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUpdateBrandCategryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUpdateBrandCategryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
