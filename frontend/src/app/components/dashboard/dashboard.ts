import { Component } from '@angular/core';
import { ActiveTaskCard } from './cards/active-task-card/active-task-card';
import { CharacterOverviewCard } from './cards/character-overview-card/character-overview-card';
import { SkillsSummaryCard } from './cards/skills-summary-card/skills-summary-card';
import { RecentActivityCard } from './cards/recent-activity-card/recent-activity-card';
import { InventorySummaryCard } from './cards/inventory-summary-card/inventory-summary-card';
import { EquippedItemsCard } from './cards/equipped-items-card/equipped-items-card';
import { NewsCard } from './cards/news-card/news-card';

@Component({
  selector: 'app-dashboard',
  imports: [ActiveTaskCard, CharacterOverviewCard, 
    SkillsSummaryCard, RecentActivityCard,
    InventorySummaryCard, EquippedItemsCard, NewsCard
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {}
