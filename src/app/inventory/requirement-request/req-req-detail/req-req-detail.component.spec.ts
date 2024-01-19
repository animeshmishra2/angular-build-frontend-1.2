import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqReqDetailComponent } from './req-req-detail.component';

describe('ReqReqDetailComponent', () => {
  let component: ReqReqDetailComponent;
  let fixture: ComponentFixture<ReqReqDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqReqDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqReqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
