import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-stats-client',
    imports: [CommonModule],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Devis</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-file text-blue-500 !text-xl"></i>
                    </div>
                </div>

            </div>

            <div class="card">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Montant Total facturé</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$12.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>

            </div>

            <div class="card">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Montant Total payé</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28,441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-green-500 !text-xl"></i>
                    </div>
                </div>

            </div>

            <div class="card">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Factures en attente</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">2</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2rem">
                        <i class="pi pi-receipt text-purple-500 !text-xl"></i>
                    </div>
                </div>

            </div>
        </div>
    `
})
export class StatsClient {}
