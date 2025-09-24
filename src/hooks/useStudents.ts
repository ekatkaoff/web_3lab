import { useQuery } from '@tanstack/react-query';
import { getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInteface';

interface StudentsHookInterface {
  students: StudentInterface[]; // исправлено groups на students
  isLoading?: boolean;
  error?: Error | null;
}

const useStudents = (): StudentsHookInterface => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: true, // изменено с false на true, чтобы запрос выполнялся
  });

  return {
    students: data ?? [],
    isLoading,
    error: error as Error | null,
  };
};

export default useStudents;
