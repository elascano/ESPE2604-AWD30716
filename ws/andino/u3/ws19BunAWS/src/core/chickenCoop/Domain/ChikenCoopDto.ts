export interface UpdateChickenCoopDto {
  name?: string;
  chickensCount?: number;
  description?: string | null;
  updatedAt?: Date;
}

export interface CreateChickenCoopDto {
  name: string;
  chickensCount: number;
  description?: string;
  isActive: boolean;
}