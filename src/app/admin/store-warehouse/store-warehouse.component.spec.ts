import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreWarehouseComponent } from './store-warehouse.component';

describe('StoreWarehouseComponent', () => {
  let component: StoreWarehouseComponent;
  let fixture: ComponentFixture<StoreWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
