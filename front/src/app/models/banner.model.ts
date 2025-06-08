export interface Banner {
  id?: number;
  userId?: number;
  imageUrl: string;
  clientLink: string;
  startDate: string;
  endDate?: string;
  position: Position;
  displayOrder: number;
  renewalType: RenewalType;
  autoRenewalPeriod?: RenewalPeriod;
}

export enum Position {
  FLOATING_MAIN = 'FLOATING_MAIN',
  HEADER = 'HEADER',
  RIGHT_SIDE = 'RIGHT_SIDE',
  FOOTER = 'FOOTER'
}

export enum RenewalType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC'
}

export enum RenewalPeriod {
  DAYS_30 = 'DAYS_30',
  DAYS_60 = 'DAYS_60',
  DAYS_90 = 'DAYS_90'
}

export interface BannerCreateResponse {
  message: string;
  banner: Banner;
}

// Utilitarios para la UI
export const POSITION_LABELS = {
  [Position.FLOATING_MAIN]: 'Flotante Principal',
  [Position.HEADER]: 'Encabezado',
  [Position.RIGHT_SIDE]: 'Lateral Derecho',
  [Position.FOOTER]: 'Pie de Página'
};

export const RENEWAL_TYPE_LABELS = {
  [RenewalType.MANUAL]: 'Manual',
  [RenewalType.AUTOMATIC]: 'Automático'
};

export const RENEWAL_PERIOD_LABELS = {
  [RenewalPeriod.DAYS_30]: '30 días',
  [RenewalPeriod.DAYS_60]: '60 días',
  [RenewalPeriod.DAYS_90]: '90 días'
};

// Límites de capacidad por posición
export const POSITION_LIMITS = {
  [Position.FLOATING_MAIN]: 1,
  [Position.HEADER]: 1,
  [Position.RIGHT_SIDE]: 3,
  [Position.FOOTER]: 2
};
