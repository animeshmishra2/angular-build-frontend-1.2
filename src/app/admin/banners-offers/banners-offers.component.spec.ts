import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersOffersComponent } from './banners-offers.component';

describe('BannersOffersComponent', () => {
  let component: BannersOffersComponent;
  let fixture: ComponentFixture<BannersOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannersOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
