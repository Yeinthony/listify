import type { Channel } from '@/api/types/products';
import type { BranchChannel } from '@/api/types/shopping-lists';

export const DISTANCES_FILTER = [1, 2.5, 5, 10, 20, 40, 80, 160, 320, 640, 900];

export const DEFAULT_CHANNEL: Channel = 'minorista';

export const CHANNELS_FILTER: BranchChannel[] = ['all', 'minorista', 'mayorista'];

export const LIMITS_FILTER = [10, 30, 50, 100, 'all'] as const;
export type LimitFilter = (typeof LIMITS_FILTER)[number];