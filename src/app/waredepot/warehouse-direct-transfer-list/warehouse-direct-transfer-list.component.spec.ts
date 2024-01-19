import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDirectTransferListComponent } from './warehouse-direct-transfer-list.component';

describe('WarehouseDirectTransferListComponent', () => {
  let component: WarehouseDirectTransferListComponent;
  let fixture: ComponentFixture<WarehouseDirectTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseDirectTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDirectTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
