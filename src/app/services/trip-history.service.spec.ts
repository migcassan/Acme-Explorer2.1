import { TestBed } from '@angular/core/testing';

import { TripHistoryService } from './trip-history.service';

describe('TripHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TripHistoryService = TestBed.get(TripHistoryService);
    expect(service).toBeTruthy();
  });
});
