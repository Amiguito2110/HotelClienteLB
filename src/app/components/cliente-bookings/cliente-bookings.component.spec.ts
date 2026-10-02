import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteBookingsComponent } from './cliente-bookings.component';

describe('ClienteBookingsComponent', () => {
  let component: ClienteBookingsComponent;
  let fixture: ComponentFixture<ClienteBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteBookingsComponent]
    });
    fixture = TestBed.createComponent(ClienteBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
