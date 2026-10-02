import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasclienteComponent } from './ofertascliente.component';

describe('OfertasclienteComponent', () => {
  let component: OfertasclienteComponent;
  let fixture: ComponentFixture<OfertasclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertasclienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertasclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
