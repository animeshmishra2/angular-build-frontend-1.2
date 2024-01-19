import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSelectComponent } from './batch-select.component';

describe('BatchSelectComponent', () => {
  let component: BatchSelectComponent;
  let fixture: ComponentFixture<BatchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
