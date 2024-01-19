import { TestBed } from '@angular/core/testing';

import { StoreWareService } from './store-ware.service';

describe('StoreWareService', () => {
  let service: StoreWareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreWareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
