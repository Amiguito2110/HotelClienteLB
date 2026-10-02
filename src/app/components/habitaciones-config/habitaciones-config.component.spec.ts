import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesConfigComponent } from './habitaciones-config.component';

describe('HabitacionesConfigComponent', () => {
  let component: HabitacionesConfigComponent;
  let fixture: ComponentFixture<HabitacionesConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitacionesConfigComponent]
    });
    fixture = TestBed.createComponent(HabitacionesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
