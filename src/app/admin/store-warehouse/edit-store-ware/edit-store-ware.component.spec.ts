import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreWareComponent } from './edit-store-ware.component';

describe('EditStoreWareComponent', () => {
  let component: EditStoreWareComponent;
  let fixture: ComponentFixture<EditStoreWareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoreWareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreWareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
