import { useQuery } from '@tanstack/react-query';
import { apiConnector } from '../services/apiconnector';
import { profileEndpoints } from '../services/apis';
import { useSelector } from 'react-redux';

const { GET_USER_DETAILS_API } = profileEndpoints;

export const useProfile = () => {
  const { token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
