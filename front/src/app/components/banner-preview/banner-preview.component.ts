import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../services/banner.service';
import { Banner, Position, POSITION_LABELS } from '../../models/banner.model';

@Component({
  selector: 'app-banner-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">Vista Previa del Sitio</h2>
        <div class="flex space-x-2">
          <button
            (click)="loadBanners()"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🔄 Actualizar
          </button>
          <button
            (click)="debugBanners()"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            🐛 Debug
          </button>
        </div>
      </div>

      <!-- Simulación del sitio web -->
      <div class="relative bg-gray-100 rounded-lg overflow-hidden" style="min-height: 600px;">

        <!-- Banner Flotante Principal -->
        <div *ngIf="bannersByPosition['FLOATING_MAIN']?.length"
             class="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 max-w-xs">
          <div *ngFor="let banner of bannersByPosition['FLOATING_MAIN']" class="w-full">
            <a [href]="banner.clientLink" target="_blank" class="block">
              <img
                [src]="banner.imageUrl"
                [alt]="'Banner ' + banner.id"
                class="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                (error)="onImageError($event)"
              />
            </a>
          </div>
        </div>

        <!-- Header del sitio -->
        <header class="bg-blue-600 text-white p-4">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Mi Red Social</h1>
            <nav class="hidden md:block">
              <a href="#" class="mx-2 hover:underline">Inicio</a>
              <a href="#" class="mx-2 hover:underline">Perfil</a>
              <a href="#" class="mx-2 hover:underline">Mensajes</a>
            </nav>
          </div>

          <!-- Banner Header -->
          <div *ngIf="bannersByPosition['HEADER']?.length" class="mt-4">
            <div *ngFor="let banner of bannersByPosition['HEADER']" class="w-full">
              <a [href]="banner.clientLink" target="_blank" class="block">
                <img
                  [src]="banner.imageUrl"
                  [alt]="'Banner ' + banner.id"
                  class="w-full h-auto max-h-24 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  (error)="onImageError($event)"
                />
              </a>
            </div>
          </div>
        </header>

        <!-- Contenido principal -->
        <div class="flex">
          <!-- Contenido central -->
          <main class="flex-1 p-4">
            <div class="space-y-4">
              <!-- Posts simulados -->
              <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div class="font-medium">Usuario Ejemplo</div>
                    <div class="text-sm text-gray-500">Hace 2 horas</div>
                  </div>
                </div>
                <p class="text-gray-700 mb-3">
                  Este es un post de ejemplo en nuestra red social. Los banners publicitarios
                  se muestran en diferentes posiciones alrededor del contenido.
                </p>
                <div class="flex space-x-4 text-sm text-gray-500">
                  <button class="hover:text-blue-600">👍 Me gusta</button>
                  <button class="hover:text-blue-600">💬 Comentar</button>
                  <button class="hover:text-blue-600">📤 Compartir</button>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div class="font-medium">Otro Usuario</div>
                    <div class="text-sm text-gray-500">Hace 5 horas</div>
                  </div>
                </div>
                <p class="text-gray-700 mb-3">
                  ¡Mira estos banners publicitarios integrados de forma natural en el diseño!
                </p>
                <div class="flex space-x-4 text-sm text-gray-500">
                  <button class="hover:text-blue-600">👍 Me gusta</button>
                  <button class="hover:text-blue-600">💬 Comentar</button>
                  <button class="hover:text-blue-600">📤 Compartir</button>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div class="font-medium">Usuario Final</div>
                    <div class="text-sm text-gray-500">Hace 1 día</div>
                  </div>
                </div>
                <p class="text-gray-700 mb-3">
                  Los banners mantienen una excelente experiencia de usuario sin ser intrusivos.
                </p>
                <div class="flex space-x-4 text-sm text-gray-500">
                  <button class="hover:text-blue-600">👍 Me gusta</button>
                  <button class="hover:text-blue-600">💬 Comentar</button>
                  <button class="hover:text-blue-600">📤 Compartir</button>
                </div>
              </div>
            </div>
          </main>

          <!-- Sidebar derecho con banners -->
          <aside class="w-80 p-4 bg-gray-50">
            <div class="space-y-4">
              <!-- Sugerencias -->
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="font-bold mb-3">Sugerencias para ti</h3>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span class="text-sm">Usuario Sugerido</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span class="text-sm">Otro Usuario</span>
                  </div>
                </div>
              </div>

              <!-- Banners Lateral Derecho -->
              <div *ngIf="bannersByPosition['RIGHT_SIDE']?.length" class="space-y-4">
                <div *ngFor="let banner of bannersByPosition['RIGHT_SIDE']"
                     class="bg-white rounded-lg shadow overflow-hidden">
                  <a [href]="banner.clientLink" target="_blank" class="block">
                    <img
                      [src]="banner.imageUrl"
                      [alt]="'Banner ' + banner.id"
                      class="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      (error)="onImageError($event)"
                    />
                  </a>
                </div>
              </div>

              <!-- Trending -->
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="font-bold mb-3">Tendencias</h3>
                <div class="space-y-2 text-sm">
                  <div>#TendenciaEjemplo</div>
                  <div>#RedSocial</div>
                  <div>#Publicidad</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- Footer con banners -->
        <footer class="bg-gray-800 text-white p-4 mt-8">
          <!-- Banners Footer -->
          <div *ngIf="bannersByPosition['FOOTER']?.length"
               class="mb-4 flex flex-wrap justify-center gap-4">
            <div *ngFor="let banner of bannersByPosition['FOOTER']"
                 class="flex-1 max-w-md">
              <a [href]="banner.clientLink" target="_blank" class="block">
                <img
                  [src]="banner.imageUrl"
                  [alt]="'Banner ' + banner.id"
                  class="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                  (error)="onImageError($event)"
                />
              </a>
            </div>
          </div>

          <div class="text-center text-sm text-gray-400">
            © 2025 Mi Red Social. Todos los derechos reservados.
          </div>
        </footer>
      </div>

      <!-- Información de banners -->
      <div class="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 class="font-bold text-gray-900 mb-4">Información de Banners Activos</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Estadísticas por posición -->
          <div *ngFor="let position of positions" class="text-center">
            <div class="text-lg font-bold text-blue-600">
              {{ getBannerCountForPosition(position.value) }} / {{ getMaxBannersForPosition(position.value) }}
            </div>
            <div class="text-sm text-gray-600">{{ position.label }}</div>
          </div>
        </div>

        <!-- Lista detallada -->
        <div class="mt-4 space-y-2">
          <div *ngFor="let position of positions" class="border-l-4 border-blue-500 pl-3">
            <div class="font-medium text-gray-900">{{ position.label }}</div>
            <div *ngIf="bannersByPosition[position.value]?.length; else noBanners"
                 class="text-sm text-gray-600 space-y-1">
              <div *ngFor="let banner of bannersByPosition[position.value]">
                Banner #{{ banner.id }} - Orden {{ banner.displayOrder }}
              </div>
            </div>
            <ng-template #noBanners>
              <div class="text-sm text-gray-400">Sin banners</div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BannerPreviewComponent implements OnInit, OnChanges {
  @Input() refreshTrigger?: any;

  banners: Banner[] = [];
  bannersByPosition: { [key: string]: Banner[] } = {};
  isLoading = false;
  errorMessage = '';

  positions = Object.entries(POSITION_LABELS).map(([value, label]) => ({ value, label }));

  constructor(private bannerService: BannerService) {}

  ngOnInit() {
    this.loadBanners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger']) {
      console.log('🔄 === REFRESH TRIGGER DETECTADO ===');
      console.log('Previous value:', changes['refreshTrigger'].previousValue);
      console.log('Current value:', changes['refreshTrigger'].currentValue);
      console.log('First change:', changes['refreshTrigger'].firstChange);

      if (!changes['refreshTrigger'].firstChange) {
        console.log('🚀 Recargando banners por trigger...');
        this.loadBanners();
      }
    }
  }

  loadBanners() {
    this.isLoading = true;
    this.errorMessage = '';

    this.bannerService.getBanners().subscribe({
      next: (banners) => {
        console.log('🔍 Banners recibidos del API:', banners);
        console.log('📅 Fecha actual:', new Date());

        this.banners = this.filterActiveBanners(banners);
        console.log('✅ Banners activos filtrados:', this.banners);

        this.organizeBannersByPosition();
        console.log('📍 Banners organizados por posición:', this.bannersByPosition);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando banners:', error);
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  private filterActiveBanners(banners: Banner[]): Banner[] {
    const now = new Date();

    // Para debug: mostrar TODOS los banners sin filtrar por fechas
    console.log('🔍 TODOS los banners recibidos (sin filtrar):', banners);

    return banners.filter(banner => {
      const startDate = new Date(banner.startDate);
      const endDate = banner.endDate ? new Date(banner.endDate) : null;

      console.log(`🕐 Evaluando banner #${banner.id}:`);
      console.log(`   Posición: ${banner.position}`);
      console.log(`   Inicio: ${startDate.toISOString()}`);
      console.log(`   Fin: ${endDate ? endDate.toISOString() : 'Sin fin'}`);
      console.log(`   Ahora: ${now.toISOString()}`);

      // TEMPORALMENTE: Mostrar TODOS los banners para debug
      console.log(`   ✅ Banner #${banner.id} incluido para debug`);
      return true;

      // TODO: Descomentar este código cuando funcione correctamente
      /*
      // El banner debe haber comenzado
      if (startDate > now) {
        console.log(`   ❌ Banner #${banner.id} aún no ha comenzado`);
        return false;
      }

      // El banner no debe haber expirado
      if (endDate && endDate < now) {
        console.log(`   ❌ Banner #${banner.id} ya expiró`);
        return false;
      }

      console.log(`   ✅ Banner #${banner.id} está activo`);
      return true;
      */
    });
  }

  private organizeBannersByPosition() {
    // Inicializar todas las posiciones
    this.bannersByPosition = {
      'FLOATING_MAIN': [],
      'HEADER': [],
      'RIGHT_SIDE': [],
      'FOOTER': []
    };

    console.log('🔄 Organizando banners por posición...');

    // Agrupar banners por posición
    this.banners.forEach(banner => {
      console.log(`📍 Procesando banner #${banner.id} - Posición: ${banner.position}`);

      if (this.bannersByPosition[banner.position]) {
        this.bannersByPosition[banner.position].push(banner);
        console.log(`✅ Banner #${banner.id} agregado a ${banner.position}`);
      } else {
        console.warn(`⚠️ Posición desconocida: ${banner.position} para banner #${banner.id}`);
      }
    });

    // Ordenar por displayOrder y aplicar límites
    Object.keys(this.bannersByPosition).forEach(position => {
      // Ordenar por displayOrder
      this.bannersByPosition[position].sort((a, b) => a.displayOrder - b.displayOrder);

      // Aplicar límites de capacidad
      const limit = this.getMaxBannersForPosition(position);
      const originalCount = this.bannersByPosition[position].length;
      this.bannersByPosition[position] = this.bannersByPosition[position].slice(0, limit);

      console.log(`📊 Posición ${position}: ${this.bannersByPosition[position].length}/${limit} banners (${originalCount} originales)`);
    });

    console.log('✅ Organización completada:', this.bannersByPosition);
  }

  getBannerCountForPosition(position: string): number {
    return this.bannersByPosition[position]?.length || 0;
  }

  getMaxBannersForPosition(position: string): number {
    switch (position) {
      case 'FLOATING_MAIN':
      case 'HEADER':
        return 1;
      case 'RIGHT_SIDE':
        return 3;
      case 'FOOTER':
        return 2;
      default:
        return 0;
    }
  }

  onImageError(event: any) {
    // Imagen de placeholder cuando falla la carga
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDMwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTM1Vjg1SDEyNVY3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTExMCA2MEgxOTBWOTBIMTEwVjYwWk0xMjAgNzBWODBIMTgwVjcwSDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHR0ZXh0IHg9IjE1MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4=';
  }

  debugBanners() {
    console.log('🐛 === DEBUG BANNERS ===');
    console.log('📊 Total banners recibidos:', this.banners.length);
    console.log('📅 Fecha actual:', new Date().toISOString());

    this.banners.forEach(banner => {
      console.log(`🏷️ Banner #${banner.id}:`);
      console.log(`   📍 Posición: ${banner.position}`);
      console.log(`   🕐 Inicio: ${banner.startDate}`);
      console.log(`   🕕 Fin: ${banner.endDate || 'Sin fecha de fin'}`);
      console.log(`   📊 Orden: ${banner.displayOrder}`);
      console.log(`   🔄 Renovación: ${banner.renewalType}`);
    });

    console.log('📍 Banners por posición:');
    Object.entries(this.bannersByPosition).forEach(([position, banners]) => {
      console.log(`   ${position}: ${banners.length} banners`);
      banners.forEach(banner => {
        console.log(`     - Banner #${banner.id} (orden ${banner.displayOrder})`);
      });
    });
    console.log('🐛 === FIN DEBUG ===');
  }
}
