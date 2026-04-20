import { useQuery } from '@tanstack/react-query';
import { fetchCourseDetails } from '../services/operations/courseDetailsApi';

export const useCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
