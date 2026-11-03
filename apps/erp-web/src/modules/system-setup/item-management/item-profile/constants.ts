import { featurePath } from '@/common/constants/routes';

export const ITEM_PROFILE_FEATURE = 'system-setup.item-profile';

export const ITEM_PROFILE_PATH = featurePath('system-setup', 'item-profile');

export const itemPaths = {
  list: ITEM_PROFILE_PATH,
  create: `${ITEM_PROFILE_PATH}/new`,
  duplicate: (id: string) => `${ITEM_PROFILE_PATH}/new?copy=${encodeURIComponent(id)}`,
  view: (id: string) => `${ITEM_PROFILE_PATH}/${encodeURIComponent(id)}`,
  edit: (id: string) => `${ITEM_PROFILE_PATH}/${encodeURIComponent(id)}/edit`,
};
