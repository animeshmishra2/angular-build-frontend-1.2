import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchProductsComponent } from './dispatch-products.component';

describe('DispatchProductsComponent', () => {
  let component: DispatchProductsComponent;
  let fixture: ComponentFixture<DispatchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
