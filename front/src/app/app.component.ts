import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerFormComponent } from './components/banner-form/banner-form.component';
import { BannerListComponent } from './components/banner-list/banner-list.component';
import { BannerPreviewComponent } from './components/banner-preview/banner-preview.component';
import { Banner } from './models/banner.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BannerFormComponent, BannerListComponent, BannerPreviewComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Sistema de Gestión de Banners
              </h1>
              <p class="text-gray-600 mt-1">
                Administra los banners publicitarios de tu red social
              </p>
            </div>

            <!-- Navegación por pestañas -->
            <nav class="flex space-x-4">
              <button
                *ngFor="let tab of tabs"
                (click)="activeTab = tab.id"
                [ngClass]="'px-4 py-2 rounded-lg font-medium transition-colors ' +
                  (activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <!-- Contenido Principal -->
      <main class="container mx-auto px-4 py-8">
        <!-- Tab: Gestión (Formulario + Lista) -->
        <div *ngIf="activeTab === 'management'" class="space-y-8">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Formulario de Creación -->
            <app-banner-form
              (bannerCreated)="onBannerCreated($event)">
            </app-banner-form>

            <!-- Lista de Banners -->
            <app-banner-list
              [refreshTrigger]="refreshTrigger">
            </app-banner-list>
          </div>
        </div>

        <!-- Tab: Vista Previa -->
        <div *ngIf="activeTab === 'preview'">
          <app-banner-preview
            [refreshTrigger]="refreshTrigger">
          </app-banner-preview>
        </div>

        <!-- Tab: Estadísticas -->
        <div *ngIf="activeTab === 'stats'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Estadísticas del Sistema</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total de Banners -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm font-medium">Total Banners</p>
                  <p class="text-3xl font-bold">{{ totalBanners }}</p>
                </div>
                <div class="bg-blue-400 rounded-full p-3">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Banners Activos -->
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm font-medium">Activos</p>
                  <p class="text-3xl font-bold">{{ activeBanners }}</p>
                </div>
                <div class="bg-green-400 rounded-full p-3">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Próximos a Vencer -->
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-100 text-sm font-medium">Por Vencer</p>
                  <p class="text-3xl font-bold">{{ expiringBanners }}</p>
                </div>
                <div class="bg-yellow-400 rounded-full p-3">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Vencidos -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-red-100 text-sm font-medium">Vencidos</p>
                  <p class="text-3xl font-bold">{{ expiredBanners }}</p>
                </div>
                <div class="bg-red-400 rounded-full p-3">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Distribución por Posición -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Distribución por Posición</h3>
              <div class="space-y-4">
                <div *ngFor="let position of positionStats" class="flex items-center justify-between">
                  <span class="text-gray-700">{{ position.label }}</span>
                  <div class="flex items-center space-x-2">
                    <div class="bg-gray-200 rounded-full h-2 w-24">
                      <div
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        [style.width.%]="(position.count / position.max) * 100">
                      </div>
                    </div>
                    <span class="text-sm text-gray-600 font-medium">
                      {{ position.count }}/{{ position.max }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Tipos de Renovación</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Manual</span>
                  <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ manualRenewalCount }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Automático</span>
                  <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ automaticRenewalCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del Sistema -->
          <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-blue-900 mb-4">Información del Sistema</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-blue-700 font-medium mb-2">Límites de Capacidad:</p>
                <ul class="space-y-1 text-blue-600">
                  <li>• Flotante Principal: 1 banner</li>
                  <li>• Encabezado: 1 banner</li>
                  <li>• Lateral Derecho: 3 banners</li>
                  <li>• Pie de Página: 2 banners</li>
                </ul>
              </div>
              <div>
                <p class="text-blue-700 font-medium mb-2">Funcionalidades:</p>
                <ul class="space-y-1 text-blue-600">
                  <li>• Renovación manual y automática</li>
                  <li>• Programación de fechas</li>
                  <li>• Vista previa en tiempo real</li>
                  <li>• Gestión de orden de visualización</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-16">
        <div class="container mx-auto px-4 py-8">
          <div class="text-center text-gray-600">
            <p class="mb-2">Sistema de Gestión de Banners v1.0</p>
            <p class="text-sm">Desarrollado con Angular 17 y Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  activeTab = 'management';
  refreshTrigger = 0;

  // Estadísticas simuladas (en una app real, estas vendrían del servicio)
  totalBanners = 0;
  activeBanners = 0;
  expiringBanners = 0;
  expiredBanners = 0;
  manualRenewalCount = 0;
  automaticRenewalCount = 0;

  tabs = [
    { id: 'management', label: '📝 Gestión' },
    { id: 'preview', label: '👁️ Vista Previa' },
    { id: 'stats', label: '📊 Estadísticas' }
  ];

  positionStats = [
    { label: 'Flotante Principal', count: 0, max: 1 },
    { label: 'Encabezado', count: 0, max: 1 },
    { label: 'Lateral Derecho', count: 0, max: 3 },
    { label: 'Pie de Página', count: 0, max: 2 }
  ];

  constructor() {
    // Simular carga inicial de estadísticas
    this.loadStats();
  }

  onBannerCreated(banner: Banner) {
    // Actualizar las vistas cuando se crea un nuevo banner
    this.refreshTrigger = Date.now(); // Usar timestamp para forzar actualización
    this.loadStats();

    // Mostrar notificación de éxito
    console.log('🎉 Banner creado exitosamente:', banner);
    console.log('🔄 Trigger de refresh actualizado:', this.refreshTrigger);

    // Cambiar a la pestaña de vista previa para ver el resultado
    setTimeout(() => {
      this.activeTab = 'preview';
    }, 500);
  }

  private loadStats() {
    // En una aplicación real, esto vendría del servicio de banners
    // Por ahora, simulamos algunos datos para la demostración
    setTimeout(() => {
      this.totalBanners = 12;
      this.activeBanners = 8;
      this.expiringBanners = 2;
      this.expiredBanners = 2;
      this.manualRenewalCount = 7;
      this.automaticRenewalCount = 5;

      // Actualizar estadísticas de posición (simuladas)
      this.positionStats = [
        { label: 'Flotante Principal', count: 1, max: 1 },
        { label: 'Encabezado', count: 1, max: 1 },
        { label: 'Lateral Derecho', count: 2, max: 3 },
        { label: 'Pie de Página', count: 1, max: 2 }
      ];
    }, 100);
  }
}
