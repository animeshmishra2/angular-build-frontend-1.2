import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipingChargesComponent } from './shiping-charges.component';

describe('ShipingChargesComponent', () => {
  let component: ShipingChargesComponent;
  let fixture: ComponentFixture<ShipingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipingChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
