import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { PlannedStoreDetailModalProps } from "./types/planned-store-detail-modal";

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

const PlannedStoreDetailModal = ({ isOpen, onClose, store, productNameById, totalItems }: PlannedStoreDetailModalProps) => {
  const { t } = useTranslation();

  if (!store) return null;

  const coveredIds = new Set(store.items.map((i) => i.productId));
  const missing = Object.keys(productNameById).filter((id) => !coveredIds.has(id));
  const hasDiscount = !!store.appliedDiscount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <VStack>
            <Heading size="md" className="uppercase">{store.storeName}</Heading>
            <Text className="text-sm text-typography-600">
              {[store.branchName, `${(store.distanceMeters / 1000).toFixed(1)} km`]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space="sm">
              {store.items.map((it) => (
                <HStack key={it.productId} className="items-center" space="md">
                  <VStack className="flex-1">
                    <Text className="text-sm font-medium uppercase" numberOfLines={2}>
                      {productNameById[it.productId] ?? it.productId}
                    </Text>
                    <Text className="text-xs text-typography-500" style={{ fontVariant: ['tabular-nums'] }}>
                      {`x${it.quantity} · ${money(it.unitPrice)} ${t('screen.lists.perUnit')}`}
                    </Text>
                  </VStack>
                  <Text className="text-sm font-bold" style={{ fontVariant: ['tabular-nums'] }}>
                    {money(it.subtotal)}
                  </Text>
                </HStack>
              ))}

              {missing.length > 0 && (
                <>
                  <Divider className="my-1" />
                  <Text className="text-xs font-bold text-error-500">
                    {t('screen.lists.notAvailable')}
                  </Text>
                  {missing.map((id) => (
                    <Text key={id} className="text-sm text-typography-500 uppercase" numberOfLines={1}>
                      {productNameById[id] ?? id}
                    </Text>
                  ))}
                </>
              )}
            </VStack>
          </ScrollView>
        </ModalBody>
        <ModalFooter>
          <VStack className="w-full" space="xs">
            {hasDiscount && (
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">
                  {`${store.appliedDiscount!.percent}% ${store.appliedDiscount!.paymentMethod}`}
                </Text>
                <Text className="text-sm text-success-500" style={{ fontVariant: ['tabular-nums'] }}>
                  {`-${money(store.appliedDiscount!.amount)}`}
                </Text>
              </HStack>
            )}
            <HStack className="justify-between items-center">
              <VStack>
                <Heading className="text-lg font-extrabold">{t('screen.lists.total')}</Heading>
                <Text className="text-xs text-typography-500">
                  {t('screen.lists.available', { covered: store.items.length, total: totalItems })}
                </Text>
              </VStack>
              <Heading className="text-2xl font-extrabold text-primary-600" style={{ fontVariant: ['tabular-nums'] }}>
                {money(store.subtotalWithDiscount)}
              </Heading>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlannedStoreDetailModal;
