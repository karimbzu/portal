import { TestBed, async, inject } from '@angular/core/testing';

import { DisabledManualURLGuard } from './can-activate-route.guard';

describe('CanActivateRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisabledManualURLGuard]
    });
  });

  it('should ...', inject([DisabledManualURLGuard], (guard: DisabledManualURLGuard) => {
    expect(guard).toBeTruthy();
  }));
});
