import { TestBed } from '@angular/core/testing';

import { ClientDevisService } from './client-devis.service';

describe('ClientDevisService', () => {
  let service: ClientDevisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientDevisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
