import { Component } from '@angular/core';
import { StatsWidget } from './../../pages/dashboard/components/statswidget';
import { RecentSalesWidget } from './../../pages/dashboard/components/recentsaleswidget';
import { BestSellingWidget } from './../../pages/dashboard/components/bestsellingwidget';

@Component({
    selector: 'app-dash-client',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget],
    templateUrl: './dash-client.component.html',
    styleUrl: './dash-client.component.scss'
})
export class DashClientComponent {

}
