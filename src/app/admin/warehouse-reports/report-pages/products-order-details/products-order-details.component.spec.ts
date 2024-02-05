import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsOrderDetailsComponent } from './products-order-details.component';

describe('ProductsOrderDetailsComponent', () => {
  let component: ProductsOrderDetailsComponent;
  let fixture: ComponentFixture<ProductsOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
