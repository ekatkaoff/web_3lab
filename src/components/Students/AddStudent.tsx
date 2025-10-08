'use client';

import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import type GroupInterface from '@/types/GroupInterface';

interface AddStudentFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
}

interface AddStudentProps {
  onSubmit: (data: AddStudentFormData) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddStudentFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      groupId: 0,
    },
  });

  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['groups'],
    queryFn: async (): Promise<GroupInterface[]> => {
      const response = await fetch('/api/groups');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка загрузки групп');
      }
      return response.json();
    },
  });

  const onFormSubmit = (data: AddStudentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-semibold mb-4">Добавить студента</h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            Имя *
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full p-2 border rounded"
            {...register('firstName', { required: 'Имя обязательно' })}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Фамилия *
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full p-2 border rounded"
            {...register('lastName', { required: 'Фамилия обязательна' })}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div>
          <label htmlFor="middleName" className="block text-sm font-medium">
            Отчество *
          </label>
          <input
            id="middleName"
            type="text"
            className="w-full p-2 border rounded"
            {...register('middleName', { required: 'Отчество обязательно' })}
          />
          {errors.middleName && <p className="text-red-500 text-sm">{errors.middleName.message}</p>}
        </div>

        <div>
          <label htmlFor="groupId" className="block text-sm font-medium">
            Группа *
          </label>
          {groupsLoading ? (
            <p className="text-gray-500">Загрузка групп...</p>
          ) : groupsError ? (
            <p className="text-red-500 text-sm">Ошибка загрузки групп</p>
          ) : (
            <select
              id="groupId"
              className="w-full p-2 border rounded"
              {...register('groupId', { 
                required: 'Выберите группу', 
                valueAsNumber: true,
                validate: value => value !== 0 || 'Выберите группу'
              })}
            >
              <option value={0}>-Выберите группу-</option>
              {groups.map((group: GroupInterface) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
          {errors.groupId && <p className="text-red-500 text-sm">{errors.groupId.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || groupsLoading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Добавляется...' : 'Добавить студента'}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;