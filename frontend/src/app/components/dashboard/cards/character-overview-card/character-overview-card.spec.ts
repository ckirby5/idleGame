import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterOverviewCard } from './character-overview-card';

describe('CharacterOverviewCard', () => {
  let component: CharacterOverviewCard;
  let fixture: ComponentFixture<CharacterOverviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterOverviewCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterOverviewCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
