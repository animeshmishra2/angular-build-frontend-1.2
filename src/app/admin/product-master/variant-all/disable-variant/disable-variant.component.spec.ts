import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableVariantComponent } from './disable-variant.component';

describe('DisableVariantComponent', () => {
  let component: DisableVariantComponent;
  let fixture: ComponentFixture<DisableVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisableVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
