import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createListScheme } from '@/utils/formSchemes';
import { CreateListPayload } from '@/api/types/shopping-lists';

interface UseCreateListFormProps {
  onCreate: (payload: CreateListPayload) => Promise<unknown>;
  onSuccess?: () => void;
}

export const useCreateListForm = ({ onCreate, onSuccess }: UseCreateListFormProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(createListScheme(t)),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await onCreate({
      name: data.name,
      description: data.description || undefined,
    });
    reset();
    onSuccess?.();
  });

  return { control, errors, onSubmit, reset };
};
