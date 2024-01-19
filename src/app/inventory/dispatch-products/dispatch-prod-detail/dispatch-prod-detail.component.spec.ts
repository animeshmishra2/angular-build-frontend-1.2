import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchProdDetailComponent } from './dispatch-prod-detail.component';

describe('DispatchProdDetailComponent', () => {
  let component: DispatchProdDetailComponent;
  let fixture: ComponentFixture<DispatchProdDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchProdDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchProdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
