import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordComponent } from './new-password.component';

describe('NewPassword', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
