import adminApi from '../apiInstances/adminApi.ts'; import type {LoyaltySettings} from '../../utils/types/loyaltySettingsTypes.ts';
export const getLoyaltySettings=():Promise<LoyaltySettings>=>adminApi.get('/loyalty-settings').then(r=>r.data);
export const updateLoyaltySettings=(data:LoyaltySettings):Promise<LoyaltySettings>=>adminApi.put('/loyalty-settings',data).then(r=>r.data);
