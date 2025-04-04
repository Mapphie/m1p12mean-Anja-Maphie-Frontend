import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { HighlightsWidget } from './components/highlightswidget';
import { ServiceAccueilComponent } from './../../components/service-accueil/service-accueil.component';
import { AppFooter } from './../../layout/component/app.footer';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, HighlightsWidget, AppFooter, RippleModule, StyleClassModule, ButtonModule, DividerModule, ServiceAccueilComponent],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <hero-widget />
                <app-service-accueil />
                <highlights-widget />
                <app-footer />
            </div>
        </div>
    `
})
export class Landing { }
