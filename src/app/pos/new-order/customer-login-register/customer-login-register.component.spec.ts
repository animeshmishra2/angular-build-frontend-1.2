import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoginRegisterComponent } from './customer-login-register.component';

describe('CustomerLoginRegisterComponent', () => {
  let component: CustomerLoginRegisterComponent;
  let fixture: ComponentFixture<CustomerLoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLoginRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
