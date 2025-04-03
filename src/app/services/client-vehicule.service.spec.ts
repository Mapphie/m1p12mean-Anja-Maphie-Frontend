import { TestBed } from '@angular/core/testing';

import { ClientVehiculeService } from './client-vehicule.service';

describe('ClientVehiculeService', () => {
  let service: ClientVehiculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientVehiculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
