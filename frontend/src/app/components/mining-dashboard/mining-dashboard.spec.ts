import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningDashboard } from './mining-dashboard';

describe('MiningDashboard', () => {
  let component: MiningDashboard;
  let fixture: ComponentFixture<MiningDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiningDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(MiningDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
