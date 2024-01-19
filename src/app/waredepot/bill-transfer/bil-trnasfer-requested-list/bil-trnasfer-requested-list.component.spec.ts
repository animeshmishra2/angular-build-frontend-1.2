import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilTrnasferRequestedListComponent } from './bil-trnasfer-requested-list.component';

describe('BilTrnasferRequestedListComponent', () => {
  let component: BilTrnasferRequestedListComponent;
  let fixture: ComponentFixture<BilTrnasferRequestedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BilTrnasferRequestedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BilTrnasferRequestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
