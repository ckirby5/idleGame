import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTaskCard } from './active-task-card';

describe('ActiveTaskCard', () => {
  let component: ActiveTaskCard;
  let fixture: ComponentFixture<ActiveTaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTaskCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveTaskCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
