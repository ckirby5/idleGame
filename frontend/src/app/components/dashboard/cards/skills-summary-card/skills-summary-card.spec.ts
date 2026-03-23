import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSummaryCard } from './skills-summary-card';

describe('SkillsSummaryCard', () => {
  let component: SkillsSummaryCard;
  let fixture: ComponentFixture<SkillsSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsSummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
