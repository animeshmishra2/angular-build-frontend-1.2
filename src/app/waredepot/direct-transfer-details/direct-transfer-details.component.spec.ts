import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectTransferDetailsComponent } from './direct-transfer-details.component';

describe('DirectTransferDetailsComponent', () => {
  let component: DirectTransferDetailsComponent;
  let fixture: ComponentFixture<DirectTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectTransferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
