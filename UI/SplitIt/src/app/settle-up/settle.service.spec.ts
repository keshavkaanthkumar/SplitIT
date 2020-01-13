import { TestBed } from '@angular/core/testing';

import { SettleService } from './settle.service';

describe('SettleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettleService = TestBed.get(SettleService);
    expect(service).toBeTruthy();
  });
});
