import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewBillComponent } from './edit-new-bill.component';

describe('EditNewBillComponent', () => {
  let component: EditNewBillComponent;
  let fixture: ComponentFixture<EditNewBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
