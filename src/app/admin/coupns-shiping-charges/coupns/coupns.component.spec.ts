import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupnsComponent } from './coupns.component';

describe('CoupnsComponent', () => {
  let component: CoupnsComponent;
  let fixture: ComponentFixture<CoupnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
