import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteStudentApi, getStudentsApi, addStudentApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (data: Omit<StudentInterface, 'id' | 'isDeleted'>) => void;
  isLoading: boolean;
  error: Error | null;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: true,  
  });

  /**
   * Мутация удаления студента
   */
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: number) => deleteStudentApi(studentId),
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      
      const updatedStudents = (previousStudents ?? []).map((student: StudentInterface) =>
        student.id === studentId ? { ...student, isDeleted: true } : student
      );
      
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      return { previousStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> deleteStudentMutate err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: (data, studentId, context) => {
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']) ?? [];
      const updatedStudents = previousStudents.filter((student: StudentInterface) => student.id !== studentId);
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
  });

 /**
   * Мутация добавления студента - теперь использует addStudentApi
   */
  const addStudentMutation = useMutation({
    mutationFn: (newStudentData: Omit<StudentInterface, 'id' | 'isDeleted'>) => addStudentApi(newStudentData),
    onMutate: async (newStudentData: Omit<StudentInterface, 'id' | 'isDeleted'>) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      
      const optimisticStudent: StudentInterface = {
        ...newStudentData,
        id: Date.now(), // Временный ID
        isDeleted: false,
      };
      
      const updatedStudents = [...(previousStudents ?? []), optimisticStudent];
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      return { previousStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> addStudentMutation err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: (newStudent: StudentInterface, variables, context) => { refetch },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutation.mutate,
    addStudentMutate: addStudentMutation.mutate,
    isLoading,
    error: error as Error,
  };
};

export default useStudents;