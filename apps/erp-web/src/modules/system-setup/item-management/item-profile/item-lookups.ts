import {
  getGetItemCategoryOptionsQueryKey,
  getGetItemChoicesQueryKey,
  getGetItemDepartmentOptionsQueryKey,
  getGetItemMinorCategoryOptionsQueryKey,
  getGetItemSubCategoryOptionsQueryKey,
  getGetUomOptionsQueryKey,
  useGetItemCategoryOptions,
  useGetItemChoices,
  useGetItemDepartmentOptions,
  useGetItemMinorCategoryOptions,
  useGetItemSubCategoryOptions,
  useGetUomOptions,
} from '@erp/api-client';
import { useUnitKey } from '../common/master-data';

export function useItemLookups(enabled = true) {
  const departments = useGetItemDepartmentOptions({
    query: { queryKey: useUnitKey(getGetItemDepartmentOptionsQueryKey()), enabled },
  });
  const categories = useGetItemCategoryOptions(undefined, {
    query: { queryKey: useUnitKey(getGetItemCategoryOptionsQueryKey()), enabled },
  });
  const subCategories = useGetItemSubCategoryOptions(undefined, {
    query: { queryKey: useUnitKey(getGetItemSubCategoryOptionsQueryKey()), enabled },
  });
  const minorCategories = useGetItemMinorCategoryOptions(undefined, {
    query: { queryKey: useUnitKey(getGetItemMinorCategoryOptionsQueryKey()), enabled },
  });
  const uoms = useGetUomOptions({
    query: { queryKey: useUnitKey(getGetUomOptionsQueryKey()), enabled },
  });
  const choices = useGetItemChoices({
    query: { queryKey: getGetItemChoicesQueryKey(), enabled, staleTime: Infinity },
  });

  return {
    departments: departments.data,
    categories: categories.data,
    subCategories: subCategories.data,
    minorCategories: minorCategories.data,
    uoms: uoms.data,
    itemTypes: choices.data?.itemTypes,
    supplyTypes: choices.data?.supplyTypes,
  };
}

export type ItemLookups = ReturnType<typeof useItemLookups>;
