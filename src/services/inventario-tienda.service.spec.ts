import { TestBed } from '@angular/core/testing';

import { InventarioTiendaService } from './inventario-tienda.service';

describe('InventarioTiendaService', () => {
  let service: InventarioTiendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioTiendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
