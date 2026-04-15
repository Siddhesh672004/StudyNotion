import { useQuery } from '@tanstack/react-query';
import { getCatalogPageData } from '../services/operations/pageAndComponntDatas';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      return res?.data?.data?.categories || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCatalog = (categoryId) => {
  return useQuery({
    queryKey: ['catalog', categoryId],
    queryFn: () => getCatalogPageData(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};
