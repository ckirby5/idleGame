import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySummaryCard } from './inventory-summary-card';

describe('InventorySummaryCard', () => {
  let component: InventorySummaryCard;
  let fixture: ComponentFixture<InventorySummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
