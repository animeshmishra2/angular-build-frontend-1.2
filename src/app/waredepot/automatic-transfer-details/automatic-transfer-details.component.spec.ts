import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticTransferDetailsComponent } from './automatic-transfer-details.component';

describe('AutomaticTransferDetailsComponent', () => {
  let component: AutomaticTransferDetailsComponent;
  let fixture: ComponentFixture<AutomaticTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticTransferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
