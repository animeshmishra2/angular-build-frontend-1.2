import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticTransferListComponent } from './automatic-transfer-list.component';

describe('AutomaticTransferListComponent', () => {
  let component: AutomaticTransferListComponent;
  let fixture: ComponentFixture<AutomaticTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
