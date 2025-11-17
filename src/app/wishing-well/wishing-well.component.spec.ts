import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishingWellComponent } from './wishing-well.component';

describe('WishingWellComponent', () => {
  let component: WishingWellComponent;
  let fixture: ComponentFixture<WishingWellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishingWellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishingWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
