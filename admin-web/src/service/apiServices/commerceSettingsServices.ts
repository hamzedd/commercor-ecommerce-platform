import adminApi from '../apiInstances/adminApi.ts';
import type { CommerceSettings } from '../../utils/types/commerceSettingsTypes.ts';

export async function getCommerceSettings(): Promise<CommerceSettings> {
  return adminApi.get('/commerce-settings').then(({ data }) => data);
}
export async function updateCommerceSettings(settings: CommerceSettings): Promise<CommerceSettings> {
  return adminApi.put('/commerce-settings', settings).then(({ data }) => data);
}
