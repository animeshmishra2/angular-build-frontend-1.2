import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantAllComponent } from './variant-all.component';

describe('VariantAllComponent', () => {
  let component: VariantAllComponent;
  let fixture: ComponentFixture<VariantAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
