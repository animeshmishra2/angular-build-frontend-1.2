import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeNameComponent } from './add-attribute-name.component';

describe('AddAttributeNameComponent', () => {
  let component: AddAttributeNameComponent;
  let fixture: ComponentFixture<AddAttributeNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttributeNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttributeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
