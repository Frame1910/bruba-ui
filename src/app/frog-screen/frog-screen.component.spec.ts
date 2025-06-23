import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrogScreenComponent } from './frog-screen.component';

describe('FrogScreenComponent', () => {
  let component: FrogScreenComponent;
  let fixture: ComponentFixture<FrogScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrogScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrogScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
