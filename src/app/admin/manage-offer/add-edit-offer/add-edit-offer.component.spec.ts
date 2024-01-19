import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOfferComponent } from './add-edit-offer.component';

describe('AddEditOfferComponent', () => {
  let component: AddEditOfferComponent;
  let fixture: ComponentFixture<AddEditOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
