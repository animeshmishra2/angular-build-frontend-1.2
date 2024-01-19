import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoreWhOrderComponent } from './manage-store-wh-order.component';

describe('ManageStoreWhOrderComponent', () => {
  let component: ManageStoreWhOrderComponent;
  let fixture: ComponentFixture<ManageStoreWhOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStoreWhOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStoreWhOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
