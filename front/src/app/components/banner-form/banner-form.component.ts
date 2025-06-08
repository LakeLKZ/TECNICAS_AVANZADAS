import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import {
  Banner,
  Position,
  RenewalType,
  RenewalPeriod,
  POSITION_LABELS,
  RENEWAL_TYPE_LABELS,
  RENEWAL_PERIOD_LABELS
} from '../../models/banner.model';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Banner</h2>

      <form [formGroup]="bannerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- URL de Imagen -->
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">
            URL de Imagen *
          </label>
          <input
            type="url"
            id="imageUrl"
            formControlName="imageUrl"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <div *ngIf="bannerForm.get('imageUrl')?.invalid && bannerForm.get('imageUrl')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="bannerForm.get('imageUrl')?.errors?.['required']">
              La URL de imagen es obligatoria
            </span>
            <span *ngIf="bannerForm.get('imageUrl')?.errors?.['pattern']">
              Debe ser una URL válida (jpg, png, gif, webp)
            </span>
          </div>
        </div>

        <!-- URL del Cliente -->
        <div>
          <label for="clientLink" class="block text-sm font-medium text-gray-700 mb-1">
            URL del Cliente *
          </label>
          <input
            type="url"
            id="clientLink"
            formControlName="clientLink"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://cliente.com"
          />
          <div *ngIf="bannerForm.get('clientLink')?.invalid && bannerForm.get('clientLink')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="bannerForm.get('clientLink')?.errors?.['required']">
              La URL del cliente es obligatoria
            </span>
            <span *ngIf="bannerForm.get('clientLink')?.errors?.['url']">
              Debe ser una URL válida
            </span>
          </div>
        </div>

        <!-- Fecha de Inicio -->
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio *
          </label>
          <input
            type="datetime-local"
            id="startDate"
            formControlName="startDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div *ngIf="bannerForm.get('startDate')?.invalid && bannerForm.get('startDate')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="bannerForm.get('startDate')?.errors?.['required']">
              La fecha de inicio es obligatoria
            </span>
            <span *ngIf="bannerForm.get('startDate')?.errors?.['minDate']">
              La fecha de inicio no puede ser anterior a hoy
            </span>
          </div>
        </div>

        <!-- Fecha de Fin (Opcional) -->
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin (Opcional)
          </label>
          <input
            type="datetime-local"
            id="endDate"
            formControlName="endDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div *ngIf="bannerForm.get('endDate')?.invalid && bannerForm.get('endDate')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="bannerForm.get('endDate')?.errors?.['minDate']">
              La fecha de fin debe ser posterior a la fecha de inicio
            </span>
          </div>
        </div>

        <!-- Posición -->
        <div>
          <label for="position" class="block text-sm font-medium text-gray-700 mb-1">
            Posición *
          </label>
          <select
            id="position"
            formControlName="position"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar posición</option>
            <option *ngFor="let position of positions" [value]="position.value">
              {{ position.label }}
            </option>
          </select>
          <div *ngIf="bannerForm.get('position')?.invalid && bannerForm.get('position')?.touched"
               class="text-red-500 text-sm mt-1">
            La posición es obligatoria
          </div>
        </div>

        <!-- Orden de Visualización -->
        <div>
          <label for="displayOrder" class="block text-sm font-medium text-gray-700 mb-1">
            Orden de Visualización *
          </label>
          <input
            type="number"
            id="displayOrder"
            formControlName="displayOrder"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div *ngIf="bannerForm.get('displayOrder')?.invalid && bannerForm.get('displayOrder')?.touched"
               class="text-red-500 text-sm mt-1">
            <span *ngIf="bannerForm.get('displayOrder')?.errors?.['required']">
              El orden es obligatorio
            </span>
            <span *ngIf="bannerForm.get('displayOrder')?.errors?.['min']">
              El orden debe ser mayor a 0
            </span>
          </div>
        </div>

        <!-- Tipo de Renovación -->
        <div>
          <label for="renewalType" class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Renovación *
          </label>
          <select
            id="renewalType"
            formControlName="renewalType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo</option>
            <option *ngFor="let type of renewalTypes" [value]="type.value">
              {{ type.label }}
            </option>
          </select>
          <div *ngIf="bannerForm.get('renewalType')?.invalid && bannerForm.get('renewalType')?.touched"
               class="text-red-500 text-sm mt-1">
            El tipo de renovación es obligatorio
          </div>
        </div>

        <!-- Período de Renovación Automática -->
        <div *ngIf="bannerForm.get('renewalType')?.value === 'AUTOMATIC'">
          <label for="autoRenewalPeriod" class="block text-sm font-medium text-gray-700 mb-1">
            Período de Renovación *
          </label>
          <select
            id="autoRenewalPeriod"
            formControlName="autoRenewalPeriod"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar período</option>
            <option *ngFor="let period of renewalPeriods" [value]="period.value">
              {{ period.label }}
            </option>
          </select>
          <div *ngIf="bannerForm.get('autoRenewalPeriod')?.invalid && bannerForm.get('autoRenewalPeriod')?.touched"
               class="text-red-500 text-sm mt-1">
            El período de renovación es obligatorio para renovación automática
          </div>
        </div>

        <!-- Botones -->
        <div class="flex space-x-4 pt-4">
          <button
            type="submit"
            [disabled]="bannerForm.invalid || isLoading"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Crear Banner</span>
            <span *ngIf="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </span>
          </button>

          <button
            type="button"
            (click)="resetForm()"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Limpiar
          </button>
        </div>

        <!-- Mensajes de Estado -->
        <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>

        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  `
})
export class BannerFormComponent implements OnInit {
  @Output() bannerCreated = new EventEmitter<Banner>();

  bannerForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  positions = Object.entries(POSITION_LABELS).map(([value, label]) => ({ value, label }));
  renewalTypes = Object.entries(RENEWAL_TYPE_LABELS).map(([value, label]) => ({ value, label }));
  renewalPeriods = Object.entries(RENEWAL_PERIOD_LABELS).map(([value, label]) => ({ value, label }));

  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService
  ) {
    this.bannerForm = this.createForm();
  }

  ngOnInit() {
    // Configurar validaciones dinámicas
    this.setupDynamicValidations();
  }

  private createForm(): FormGroup {
    const today = new Date();
    const todayString = today.toISOString().slice(0, 16);

    return this.fb.group({
      imageUrl: ['', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
      ]],
      clientLink: ['', [Validators.required, this.urlValidator]],
      startDate: [todayString, [Validators.required, this.minDateValidator]],
      endDate: ['', [this.endDateValidator.bind(this)]],
      position: ['', Validators.required],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
      renewalType: ['', Validators.required],
      autoRenewalPeriod: ['']
    });
  }

  private setupDynamicValidations() {
    // Escuchar cambios en renewalType
    this.bannerForm.get('renewalType')?.valueChanges.subscribe(value => {
      const autoRenewalControl = this.bannerForm.get('autoRenewalPeriod');

      if (value === RenewalType.AUTOMATIC) {
        autoRenewalControl?.setValidators([Validators.required]);
      } else {
        autoRenewalControl?.clearValidators();
        autoRenewalControl?.setValue('');
      }
      autoRenewalControl?.updateValueAndValidity();
    });
  }

  // Validadores personalizados
  private urlValidator(control: any) {
    if (!control.value) return null;

    try {
      new URL(control.value);
      return null;
    } catch {
      return { url: true };
    }
  }

  private minDateValidator(control: any) {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { minDate: true };
  }

  private endDateValidator(control: any) {
    if (!control.value) return null;

    const startDateControl = this.bannerForm?.get('startDate');
    if (!startDateControl?.value) return null;

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);

    return endDate > startDate ? null : { minDate: true };
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const formValue = this.bannerForm.value;

      // Preparar datos para enviar
      const bannerData: Banner = {
        imageUrl: formValue.imageUrl,
        clientLink: formValue.clientLink,
        startDate: formValue.startDate,
        endDate: formValue.endDate || undefined,
        position: formValue.position as Position,
        displayOrder: formValue.displayOrder,
        renewalType: formValue.renewalType as RenewalType,
        autoRenewalPeriod: formValue.renewalType === RenewalType.AUTOMATIC
          ? formValue.autoRenewalPeriod as RenewalPeriod
          : undefined
      };

      // Debug: Mostrar los datos que se van a enviar
      console.log('🚀 === ENVIANDO BANNER ===');
      console.log('📋 Datos del formulario:', formValue);
      console.log('📦 Datos preparados para API:', bannerData);
      console.log('📍 Posición seleccionada:', formValue.position);
      console.log('🚀 === FIN DEBUG ENVÍO ===');

      this.bannerService.createBanner(bannerData).subscribe({
        next: (response) => {
          console.log('✅ === RESPUESTA DEL SERVIDOR ===');
          console.log('📨 Respuesta completa:', response);
          console.log('🏷️ Banner creado:', response.banner);
          console.log('📍 Posición en respuesta:', response.banner.position);
          console.log('✅ === FIN RESPUESTA ===');

          this.isLoading = false;
          this.successMessage = response.message;
          this.bannerCreated.emit(response.banner);
          this.resetForm();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = `Error al crear banner: ${error}`;
        }
      });
    }
  }

  resetForm() {
    this.bannerForm.reset();
    const today = new Date().toISOString().slice(0, 16);
    this.bannerForm.patchValue({
      startDate: today,
      displayOrder: 1
    });
    this.clearMessages();
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
