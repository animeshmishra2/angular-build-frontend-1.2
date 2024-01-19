import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaredepotHomeComponent } from './waredepot-home.component';

describe('WaredepotHomeComponent', () => {
  let component: WaredepotHomeComponent;
  let fixture: ComponentFixture<WaredepotHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaredepotHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaredepotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
