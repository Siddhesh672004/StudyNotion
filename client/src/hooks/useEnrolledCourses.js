import { useQuery } from '@tanstack/react-query';
import { getUserEnrolledCourses } from '../services/operations/profileAPI';
import { useSelector } from 'react-redux';

export const useEnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => getUserEnrolledCourses(token),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
