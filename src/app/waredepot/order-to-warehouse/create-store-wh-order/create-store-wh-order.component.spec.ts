import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoreWhOrderComponent } from './create-store-wh-order.component';

describe('CreateStoreWhOrderComponent', () => {
  let component: CreateStoreWhOrderComponent;
  let fixture: ComponentFixture<CreateStoreWhOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStoreWhOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStoreWhOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
