import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { collaboratorScheme } from '@/utils/formSchemes';
import { AddCollaboratorPayload } from '@/api/types/shopping-lists';

interface UseInviteCollaboratorFormProps {
  onInvite: (payload: AddCollaboratorPayload) => Promise<unknown>;
}

export const useInviteCollaboratorForm = ({ onInvite }: UseInviteCollaboratorFormProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(collaboratorScheme(t)),
    defaultValues: {
      email: '',
      role: 'reader' as 'reader' | 'editor',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await onInvite({ email: data.email, role: data.role });
    reset();
  });

  return { control, errors, onSubmit };
};
