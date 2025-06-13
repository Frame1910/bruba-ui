import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadScreenComponent } from './sad-screen.component';

describe('SadScreenComponent', () => {
  let component: SadScreenComponent;
  let fixture: ComponentFixture<SadScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
