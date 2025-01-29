import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteManagementComponentComponent } from './invite-management.component';

describe('InviteManagementComponentComponent', () => {
  let component: InviteManagementComponentComponent;
  let fixture: ComponentFixture<InviteManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteManagementComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
