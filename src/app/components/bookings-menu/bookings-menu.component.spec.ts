import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsMenuComponent } from './bookings-menu.component';

describe('BookingsMenuComponent', () => {
  let component: BookingsMenuComponent;
  let fixture: ComponentFixture<BookingsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsMenuComponent]
    });
    fixture = TestBed.createComponent(BookingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
