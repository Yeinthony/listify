import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Motion } from '@legendapp/motion';
import { ListCollaborator, ListRole } from '@/types/shopping-lists';

const MotionView = Motion.View as any;

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('') || '?';

const roleBadgeClass: Record<ListRole, string> = {
  owner: 'bg-primary-500/15',
  editor: 'bg-info-500/15',
  reader: 'bg-background-200',
};

const roleTextClass: Record<ListRole, string> = {
  owner: 'text-primary-600',
  editor: 'text-info-600',
  reader: 'text-typography-600',
};

interface CollaboratorCardProps {
  collaborator: ListCollaborator;
  canManage?: boolean;
  isYou?: boolean;
  onChangeRole?: (role: 'reader' | 'editor') => void;
  onRemove?: () => void;
}

export const CollaboratorCard = ({
  collaborator,
  canManage = false,
  isYou = false,
  onChangeRole,
  onRemove,
}: CollaboratorCardProps) => {
  const { t } = useTranslation();
  const { user, role } = collaborator;
  const displayName = user.username || user.email;
  const manageable = canManage && role !== 'owner';

  const content = (
    <HStack space='md' className='items-center'>
      <Avatar size='md' className='bg-primary-600'>
        <AvatarFallbackText>{initials(displayName)}</AvatarFallbackText>
      </Avatar>

      <VStack className='flex-1'>
        <HStack space='sm' className='items-center'>
          <Heading className='text-[14px] font-bold' numberOfLines={1}>{displayName}</Heading>
          {isYou && (
            <Badge size='sm' className='rounded-full bg-primary-500/15'>
              <BadgeText className='text-primary-600 lowercase'>{t('screen.lists.you')}</BadgeText>
            </Badge>
          )}
        </HStack>
        <Text selectable className='text-sm text-typography-600' numberOfLines={1}>{user.email}</Text>
      </VStack>

      <Badge size='sm' className={`rounded-full ${roleBadgeClass[role]}`}>
        <BadgeText className={`capitalize ${roleTextClass[role]}`}>{t(`role.${role}`)}</BadgeText>
      </Badge>

      {manageable && (
        <Ionicons name='ellipsis-vertical' size={18} color='#9ca3af' />
      )}
    </HStack>
  );

  return (
    <MotionView
      className='bg-background-0 rounded-2xl p-4'
      style={{ borderCurve: 'continuous' }}
      initial={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
    >
      {manageable ? (
        <Menu
          placement='bottom right'
          offset={5}
          closeOnSelect
          trigger={({ ...triggerProps }) => (
            <TouchableOpacity {...triggerProps}>{content}</TouchableOpacity>
          )}
        >
          <MenuItem
            key='role'
            textValue='role'
            onPress={() => onChangeRole?.(role === 'reader' ? 'editor' : 'reader')}
          >
            <Ionicons name='swap-horizontal' size={18} color='#6b7280' />
            <MenuItemLabel size='sm' className='ml-2'>
              {t(role === 'reader' ? 'screen.lists.makeEditor' : 'screen.lists.makeReader')}
            </MenuItemLabel>
          </MenuItem>
          <MenuItem key='remove' textValue='remove' onPress={() => onRemove?.()}>
            <Ionicons name='trash-outline' size={18} color='#E63535' />
            <MenuItemLabel size='sm' className='ml-2 text-error-500'>
              {t('screen.lists.removeCollaborator')}
            </MenuItemLabel>
          </MenuItem>
        </Menu>
      ) : (
        content
      )}
    </MotionView>
  );
};
