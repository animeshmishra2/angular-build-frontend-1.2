import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticTransferRequestListComponent } from './automatic-transfer-request-list.component';

describe('AutomaticTransferRequestListComponent', () => {
  let component: AutomaticTransferRequestListComponent;
  let fixture: ComponentFixture<AutomaticTransferRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticTransferRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticTransferRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
