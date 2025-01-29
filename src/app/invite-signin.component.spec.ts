import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteSigninComponentComponent } from './invite-signin.component';

describe('InviteSigninComponentComponent', () => {
  let component: InviteSigninComponentComponent;
  let fixture: ComponentFixture<InviteSigninComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteSigninComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteSigninComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
