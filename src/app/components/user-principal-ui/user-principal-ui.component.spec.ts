import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrincipalUIComponent } from './user-principal-ui.component';

describe('UserPrincipalUIComponent', () => {
  let component: UserPrincipalUIComponent;
  let fixture: ComponentFixture<UserPrincipalUIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPrincipalUIComponent]
    });
    fixture = TestBed.createComponent(UserPrincipalUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
