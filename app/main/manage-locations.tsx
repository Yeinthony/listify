import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useManageLocations } from '@/hooks/screens/useManageLocations';
import { Spinner } from '@/components/ui/spinner';
import { AddLocationModal } from '@/components/modals/AddLocationMapModal';
import AlertModal from '@/components/modals/AlertModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomHeader from '@/components/generals/CustomHeader';
import LocationCard from '@/components/cards/LocationCard';


export default function ManageLocations() {
  const {
    loading,
    locations,
    showAddLocationModal,
    setShowAddLocationModal,
    editingLocation,
    setEditingLocation,
    deletingLocation,
    setDeletingLocation,
    closeLocationModal,
    confirmDelete
   } = useManageLocations()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets();

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack 
        className='w-full bg-primary-500 rounded-b-[15%] relative pb-4'
        style={{ paddingTop: insets.top }}
      >
        <CustomHeader 
          title={t('screen.manage-locations.title')} 
          white
        />
        <VStack className='mx-5 py-3'>
          <Text
            className='text-md
            text-white font-light'
          >
            {t('screen.manage-locations.subtitle')}
          </Text>
        </VStack>
      </VStack>

      <SafeAreaView className='flex-1'>
        <VStack 
          className='flex-1 m-4'
        >
          {loading ? (
            <Center className="flex-1">
              <Spinner
                size="large"
                className="mr-2 mt-3"
                color="#e44b5e"
              />
              <Text className='text-lg mt-4'>
                Cargando ubicaciones     
              </Text>
            </Center>
          ) : (
            locations.length === 0 ? (
              <Center className="flex-1">
                <Center className='p-8 rounded-full bg-primary-500/20'>
                  <Ionicons 
                    name="location-outline" 
                    size={60} 
                    color="#e44b5e" 
                  />
                </Center>
                <Text className='text-lg mt-4'>
                  Sin ubicaciones registradas     
                </Text>
              </Center>
            ) : (
                <ScrollView className='flex-1'>
                  <VStack className='flex-1' space='sm'>
                    {locations.map(location => (
                      <LocationCard
                        key={location.id ?? location.name}
                        location={location}
                        onEdit={setEditingLocation}
                        onDelete={setDeletingLocation}
                      />
                    ))}
                  </VStack>
                </ScrollView>
            )
          )}
          <TouchableOpacity onPress={() => setShowAddLocationModal(true)}>
            <Center 
              className={
                `bg-primary-500 rounded-2xl px-4 h-14`
              }
            >
              <Text className="font-medium text-white">
                Agregar ubicación
              </Text>
            </Center>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
      <AddLocationModal
        isOpen={showAddLocationModal || !!editingLocation}
        location={editingLocation ?? undefined}
        onClose={closeLocationModal}
      />
      <AlertModal
        type="error"
        title={t('screen.manage-locations.deleteTitle')}
        description={t('screen.manage-locations.deleteDescription')}
        isOpen={!!deletingLocation}
        onClose={() => setDeletingLocation(null)}
        onAction={confirmDelete}
      />
    </VStack>
  );
}
