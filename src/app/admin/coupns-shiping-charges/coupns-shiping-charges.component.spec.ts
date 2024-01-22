import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupnsShipingChargesComponent } from './coupns-shiping-charges.component';

describe('CoupnsShipingChargesComponent', () => {
  let component: CoupnsShipingChargesComponent;
  let fixture: ComponentFixture<CoupnsShipingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupnsShipingChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupnsShipingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
