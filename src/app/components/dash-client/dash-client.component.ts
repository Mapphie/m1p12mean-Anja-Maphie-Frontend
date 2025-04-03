import { Component } from '@angular/core';
import { NotificationsWidget } from './../../pages/dashboard/components/notificationswidget';
import { StatsWidget } from './../../pages/dashboard/components/statswidget';
import { RecentSalesWidget } from './../../pages/dashboard/components/recentsaleswidget';
import { BestSellingWidget } from './../../pages/dashboard/components/bestsellingwidget';
import { RevenueStreamWidget } from './../../pages/dashboard/components/revenuestreamwidget';

@Component({
    selector: 'app-dash-client',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    templateUrl: './dash-client.component.html',
    styleUrl: './dash-client.component.scss'
})
export class DashClientComponent {

}
