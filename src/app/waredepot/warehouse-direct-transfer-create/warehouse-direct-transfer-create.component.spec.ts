import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDirectTransferCreateComponent } from './warehouse-direct-transfer-create.component';

describe('WarehouseDirectTransferCreateComponent', () => {
  let component: WarehouseDirectTransferCreateComponent;
  let fixture: ComponentFixture<WarehouseDirectTransferCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseDirectTransferCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDirectTransferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
