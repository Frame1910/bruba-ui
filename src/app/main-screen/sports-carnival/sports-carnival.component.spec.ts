import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsCarnivalComponent } from './sports-carnival.component';

describe('SportsCarnivalComponent', () => {
  let component: SportsCarnivalComponent;
  let fixture: ComponentFixture<SportsCarnivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsCarnivalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsCarnivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
