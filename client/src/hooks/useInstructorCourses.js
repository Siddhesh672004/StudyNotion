import { useQuery } from '@tanstack/react-query';
import { fetchInstructorCourses } from '../services/operations/courseDetailsApi';
import { useSelector } from 'react-redux';

export const useInstructorCourses = () => {
  const { token } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ['instructorCourses'],
    queryFn: () => fetchInstructorCourses(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
