import { useQuery } from '@tanstack/react-query';
import { getInstructorData } from '../services/operations/profileAPI';
import { useSelector } from 'react-redux';

export const useInstructorData = () => {
  const { token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ['instructorData'],
    queryFn: () => getInstructorData(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
