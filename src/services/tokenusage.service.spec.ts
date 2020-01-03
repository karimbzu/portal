import { TestBed } from '@angular/core/testing';

import { TokenUsageService } from './tokenusage.service';

describe('OrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenUsageService = TestBed.get(TokenUsageService);
    expect(service).toBeTruthy();
  });
});
