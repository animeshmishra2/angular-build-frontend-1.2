import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductMasterComponent } from './edit-product-master.component';

describe('EditProductMasterComponent', () => {
  let component: EditProductMasterComponent;
  let fixture: ComponentFixture<EditProductMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
