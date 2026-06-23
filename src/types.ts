export type WasteType = 'plastic' | 'paper' | 'metal' | 'glass';

export interface Pickup {
  id: string;
  type: WasteType;
  weight: number;
  address: string;
  photo: string | null;
  status: 'available' | 'claimed';
  createdAt: string;
  residentId: string;
}

export type Role = 'resident' | 'recycler';
