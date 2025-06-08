import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import {
  Banner,
  Position,
  POSITION_LABELS,
  RENEWAL_TYPE_LABELS,
  RENEWAL_PERIOD_LABELS
} from '../../models/banner.model';

interface BannerStatus {
  banner: Banner;
  status: 'active' | 'expiring' | 'expired' | 'scheduled';
  statusLabel: string;
  statusColor: string;
}

@Component({
  selector: 'app-banner-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">Lista de Banners</h2>
        <button
          (click)="refreshBanners()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Actualizar
        </button>
      </div>

      <!-- Filtros -->
      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap gap-4">
          <!-- Filtro por Posición -->
          <div class="flex-1 min-w-48">
            <label for="positionFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Posición
            </label>
            <select
              id="positionFilter"
              [(ngModel)]="selectedPosition"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las posiciones</option>
              <option *ngFor="let position of positions" [value]="position.value">
                {{ position.label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Estado -->
          <div class="flex-1 min-w-48">
            <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estado
            </label>
            <select
              id="statusFilter"
              [(ngModel)]="selectedStatus"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="expiring">Próximos a vencer</option>
              <option value="expired">Vencidos</option>
              <option value="scheduled">Programados</option>
            </select>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.active }}</div>
            <div class="text-sm text-gray-600">Activos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ stats.expiring }}</div>
            <div class="text-sm text-gray-600">Por vencer</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ stats.expired }}</div>
            <div class="text-sm text-gray-600">Vencidos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ stats.scheduled }}</div>
            <div class="text-sm text-gray-600">Programados</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredBanners.length === 0 && !errorMessage"
           class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No hay banners que mostrar</p>
      </div>

      <!-- Lista de Banners -->
      <div *ngIf="!isLoading && filteredBanners.length > 0" class="space-y-4">
        <div *ngFor="let bannerStatus of filteredBanners"
             class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Información Principal -->
            <div class="flex-1">
              <div class="flex items-start space-x-4">
                <!-- Imagen Thumbnail -->
                <div class="flex-shrink-0">
                  <img
                    [src]="bannerStatus.banner.imageUrl"
                    [alt]="'Banner ' + bannerStatus.banner.id"
                    class="w-16 h-16 object-cover rounded-md border border-gray-300"
                    (error)="onImageError($event)"
                  />
                </div>

                <!-- Detalles -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="font-medium text-gray-900">Banner #{{ bannerStatus.banner.id }}</h3>
                    <span [ngClass]="'px-2 py-1 text-xs font-medium rounded-full ' + bannerStatus.statusColor">
                      {{ bannerStatus.statusLabel }}
                    </span>
                  </div>

                  <div class="space-y-1 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Posición:</span>
                      {{ getPositionLabel(bannerStatus.banner.position) }}
                    </div>
                    <div>
                      <span class="font-medium">Orden:</span>
                      {{ bannerStatus.banner.displayOrder }}
                    </div>
                    <div>
                      <span class="font-medium">Renovación:</span>
                      {{ getRenewalTypeLabel(bannerStatus.banner.renewalType) }}
                      <span *ngIf="bannerStatus.banner.autoRenewalPeriod">
                        ({{ getRenewalPeriodLabel(bannerStatus.banner.autoRenewalPeriod) }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fechas y Acciones -->
            <div class="flex-shrink-0 space-y-2">
              <div class="text-sm text-gray-600">
                <div>
                  <span class="font-medium">Inicio:</span>
                  {{ formatDate(bannerStatus.banner.startDate) }}
                </div>
                <div *ngIf="bannerStatus.banner.endDate">
                  <span class="font-medium">Fin:</span>
                  {{ formatDate(bannerStatus.banner.endDate) }}
                </div>
                <div *ngIf="!bannerStatus.banner.endDate" class="text-blue-600">
                  Permanente
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex space-x-2">
                <a
                  [href]="bannerStatus.banner.clientLink"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver sitio ↗
                </a>
                <button
                  (click)="previewBanner(bannerStatus.banner)"
                  class="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <!-- Información adicional expandible -->
          <div *ngIf="bannerStatus.banner.id === expandedBannerId"
               class="mt-4 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">URL de Imagen:</span>
                <div class="break-all text-gray-600">{{ bannerStatus.banner.imageUrl }}</div>
              </div>
              <div>
                <span class="font-medium text-gray-700">URL del Cliente:</span>
                <div class="break-all text-gray-600">{{ bannerStatus.banner.clientLink }}</div>
              </div>
            </div>
          </div>

          <!-- Toggle para expandir/colapsar -->
          <button
            (click)="toggleExpanded(bannerStatus.banner.id!)"
            class="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            {{ bannerStatus.banner.id === expandedBannerId ? 'Menos detalles' : 'Más detalles' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class BannerListComponent implements OnInit, OnChanges {
  @Input() refreshTrigger?: any;

  banners: Banner[] = [];
  filteredBanners: BannerStatus[] = [];
  isLoading = false;
  errorMessage = '';
  expandedBannerId: number | null = null;

  // Filtros
  selectedPosition = '';
  selectedStatus = '';

  // Estadísticas
  stats = {
    active: 0,
    expiring: 0,
    expired: 0,
    scheduled: 0
  };

  positions = Object.entries(POSITION_LABELS).map(([value, label]) => ({ value, label }));

  constructor(private bannerService: BannerService) {}

  ngOnInit() {
    this.loadBanners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      console.log('📋 Lista: Refresh trigger detectado, recargando banners...');
      this.loadBanners();
    }
  }

  loadBanners() {
    this.isLoading = true;
    this.errorMessage = '';

    this.bannerService.getBanners().subscribe({
      next: (banners) => {
        this.banners = banners;
        this.processBanners();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  refreshBanners() {
    this.loadBanners();
  }

  private processBanners() {
    const bannersWithStatus: BannerStatus[] = this.banners.map(banner => {
      const status = this.getBannerStatus(banner);
      return {
        banner,
        status: status.status,
        statusLabel: status.label,
        statusColor: status.color
      };
    });

    // Calcular estadísticas
    this.stats = {
      active: bannersWithStatus.filter(b => b.status === 'active').length,
      expiring: bannersWithStatus.filter(b => b.status === 'expiring').length,
      expired: bannersWithStatus.filter(b => b.status === 'expired').length,
      scheduled: bannersWithStatus.filter(b => b.status === 'scheduled').length
    };

    return bannersWithStatus;
  }

  private getBannerStatus(banner: Banner): { status: BannerStatus['status'], label: string, color: string } {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = banner.endDate ? new Date(banner.endDate) : null;

    // Banner programado (aún no ha comenzado)
    if (startDate > now) {
      return {
        status: 'scheduled',
        label: 'Programado',
        color: 'bg-blue-100 text-blue-800'
      };
    }

    // Banner vencido
    if (endDate && endDate < now) {
      return {
        status: 'expired',
        label: 'Vencido',
        color: 'bg-red-100 text-red-800'
      };
    }

    // Banner próximo a vencer (3 días o menos)
    if (endDate) {
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 3) {
        return {
          status: 'expiring',
          label: `Vence en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? 's' : ''}`,
          color: 'bg-yellow-100 text-yellow-800'
        };
      }
    }

    // Banner activo
    return {
      status: 'active',
      label: 'Activo',
      color: 'bg-green-100 text-green-800'
    };
  }

  applyFilters() {
    let filtered = this.processBanners();

    // Filtro por posición
    if (this.selectedPosition) {
      filtered = filtered.filter(b => b.banner.position === this.selectedPosition);
    }

    // Filtro por estado
    if (this.selectedStatus) {
      filtered = filtered.filter(b => b.status === this.selectedStatus);
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => {
      const aId = a.banner.id || 0;
      const bId = b.banner.id || 0;
      return bId - aId;
    });

    this.filteredBanners = filtered;
  }

  toggleExpanded(bannerId: number) {
    this.expandedBannerId = this.expandedBannerId === bannerId ? null : bannerId;
  }

  previewBanner(banner: Banner) {
    // Aquí se podría emitir un evento para mostrar el banner en el componente de preview
    console.log('Preview banner:', banner);
  }

  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEgyNFYzMkgyMFYyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2IDIwSDQ4VjQ0SDE2VjIwWk0yMCAyNFY0MEg0NFYyNEgyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPositionLabel(position: Position): string {
    return POSITION_LABELS[position] || position;
  }

  getRenewalTypeLabel(renewalType: string): string {
    return RENEWAL_TYPE_LABELS[renewalType as keyof typeof RENEWAL_TYPE_LABELS] || renewalType;
  }

  getRenewalPeriodLabel(period: string): string {
    return RENEWAL_PERIOD_LABELS[period as keyof typeof RENEWAL_PERIOD_LABELS] || period;
  }
}
