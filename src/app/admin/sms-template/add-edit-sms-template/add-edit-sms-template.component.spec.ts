import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSmsTemplateComponent } from './add-edit-sms-template.component';

describe('AddEditSmsTemplateComponent', () => {
  let component: AddEditSmsTemplateComponent;
  let fixture: ComponentFixture<AddEditSmsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSmsTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
