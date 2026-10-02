import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesEnvioComponent } from './promociones-envio.component';

describe('PromocionesEnvioComponent', () => {
  let component: PromocionesEnvioComponent;
  let fixture: ComponentFixture<PromocionesEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromocionesEnvioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionesEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
