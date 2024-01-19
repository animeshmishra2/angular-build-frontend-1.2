import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticTransferProductComponent } from './automatic-transfer-product.component';

describe('AutomaticTransferProductComponent', () => {
  let component: AutomaticTransferProductComponent;
  let fixture: ComponentFixture<AutomaticTransferProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticTransferProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticTransferProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
