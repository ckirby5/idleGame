import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquippedItemsCard } from './equipped-items-card';

describe('EquippedItemsCard', () => {
  let component: EquippedItemsCard;
  let fixture: ComponentFixture<EquippedItemsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquippedItemsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EquippedItemsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
