import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusOnlineOrderComponent } from './change-status-online-order.component';

describe('ChangeStatusOnlineOrderComponent', () => {
  let component: ChangeStatusOnlineOrderComponent;
  let fixture: ComponentFixture<ChangeStatusOnlineOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStatusOnlineOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusOnlineOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
