import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { useProductDetails } from "@/hooks/screens/useProductDetails";
import { useAddToList } from "@/hooks/screens/useAddToList";
import { StoreByProductModal } from "@/components/modals/StoreByProductModal";
import { BranchsMapModal } from "@/components/modals/BranchsMapModal";
import AddToListModal from "@/components/modals/AddToListModal";
import QuantityPickerModal from "@/components/modals/QuantityPickerModal";
import helpers from "@/utils/helpers";

const PLACEHOLDER_IMG = "https://picsum.photos/400/400";

function StoreLogo({ uri, name }: { uri?: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <Center className="w-9 h-9 rounded-lg bg-primary-500/10">
        <Ionicons name="storefront-outline" size={18} color="#e44b5e" />
      </Center>
    );
  }

  return (
    <Image
      source={{ uri }}
      alt={name}
      size="none"
      className="w-9 h-9 rounded-lg bg-background-200"
      onError={() => setFailed(true)}
    />
  );
}

export default function ProductDetails() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const [showAddToList, setShowAddToList] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { addToList, adding } = useAddToList(() => {
    setShowQuantity(false);
    setSelectedListId(null);
  });

  const onSelectList = (listId: string) => {
    setSelectedListId(listId);
    setShowAddToList(false);
    setTimeout(() => setShowQuantity(true), 250);
  };

  const {
    loading,
    productData,
    showStoreByProductModal,
    selectedStore,
    location,
    showBranchsMapModal,
    setShowBranchsMapModal,
    setShowStoreByProductModal,
    setSelectedStore,
  } = useProductDetails();

  const product = productData?.product;
  const stores = productData?.availableStores ?? [];

  const subtitle = [
    product?.brand,
    product?.presentationQty != null && product?.presentationUnit
      ? `${product.presentationQty} ${product.presentationUnit}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (loading && !productData) {
    return (
      <Center className="flex-1 bg-background-100">
        <Spinner size="large" color="#e44b5e" />
      </Center>
    );
  }

  return (
    <VStack className="flex-1 bg-background-100">
      <View className="relative">
        <Image
          source={{ uri: product?.imageUrl || PLACEHOLDER_IMG }}
          alt={product?.name}
          size="none"
          className="w-full h-[260px] bg-background-200"
          resizeMode="cover"
        />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0" pointerEvents="box-none">
          <HStack className="px-4 pt-1">
            <TouchableOpacity onPress={() => router.back()} className="bg-background-0 p-2 rounded-xl">
              <Ionicons name="chevron-back" size={20} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </HStack>
        </SafeAreaView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="xs">
          <Heading className="text-lg uppercase">{product?.name}</Heading>
          {!!subtitle && <Text className="text-typography-600 capitalize">{subtitle}</Text>}
        </VStack>

        <VStack space="md">
          <Heading className="text-[14px] font-semibold">{t("screen.product.priceRange")}</Heading>
          <HStack className="items-center bg-background-0 rounded-2xl p-4" style={{ borderCurve: "continuous" }}>
            <VStack className="flex-1 items-center" space="xs">
              <Text className="text-xs text-typography-500">{t("screen.product.min")}</Text>
              <Text className="text-success-500 text-xl font-extrabold" style={{ fontVariant: ["tabular-nums"] }}>
                ${helpers.roundOrDecimals(productData?.stats.min || "")}
              </Text>
            </VStack>
            <Divider orientation="vertical" className="h-8" />
            <VStack className="flex-1 items-center" space="xs">
              <Text className="text-xs text-typography-500">{t("screen.product.avg")}</Text>
              <Text className="text-primary-600 text-2xl font-extrabold" style={{ fontVariant: ["tabular-nums"] }}>
                ${helpers.roundOrDecimals(productData?.stats.avg || "")}
              </Text>
            </VStack>
            <Divider orientation="vertical" className="h-8" />
            <VStack className="flex-1 items-center" space="xs">
              <Text className="text-xs text-typography-500">{t("screen.product.max")}</Text>
              <Text className="text-error-500 text-xl font-extrabold" style={{ fontVariant: ["tabular-nums"] }}>
                ${helpers.roundOrDecimals(productData?.stats.max || "")}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <VStack space="md">
          <HStack className="justify-between items-center">
            <Heading className="text-[14px] font-semibold">{t("screen.product.availableIn")}</Heading>
            <TouchableOpacity onPress={() => setShowBranchsMapModal(true)}>
              <Text className="text-primary-500 font-medium">{t("screen.product.viewMap")}</Text>
            </TouchableOpacity>
          </HStack>

          {stores.length === 0 ? (
            <Center className="bg-background-0 rounded-2xl py-8 px-4" style={{ borderCurve: "continuous" }}>
              <Text className="text-typography-500 text-center">{t("screen.product.noStores")}</Text>
            </Center>
          ) : (
            <VStack className="bg-background-0 rounded-2xl overflow-hidden" style={{ borderCurve: "continuous" }}>
              {stores.map((store, i) => (
                <View key={store.id}>
                  <TouchableOpacity
                    className="px-4 py-3"
                    onPress={() => {
                      setSelectedStore(store);
                      setShowStoreByProductModal(true);
                    }}
                  >
                    <HStack className="items-center" space="md">
                      <StoreLogo uri={store.logoUrl} name={store.name} />
                      <Text className="flex-1" numberOfLines={1}>{store.name}</Text>
                      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                    </HStack>
                  </TouchableOpacity>
                  {i !== stores.length - 1 && <Divider className="w-[92%] self-center" />}
                </View>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>

      <SafeAreaView edges={["bottom"]}>
        <VStack className="px-4 pt-2 pb-2">
          <Pressable
            onPress={() => setShowAddToList(true)}
            style={({ pressed }) => ({
              borderCurve: "continuous",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            className="h-14 rounded-2xl bg-primary-500 flex-row justify-center items-center"
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-medium ml-2">{t("screen.product.addToList")}</Text>
          </Pressable>
        </VStack>
      </SafeAreaView>

      <StoreByProductModal
        isOpen={showStoreByProductModal}
        ean={product?.ean || ""}
        store={selectedStore}
        location={location}
        onClose={() => setShowStoreByProductModal(false)}
      />
      <BranchsMapModal
        isOpen={showBranchsMapModal}
        onClose={() => setShowBranchsMapModal(false)}
        location={location}
        availableStores={stores}
        product={{ name: product?.name || "", ean: product?.ean || "" }}
      />
      <AddToListModal isOpen={showAddToList} onClose={() => setShowAddToList(false)} onSelect={onSelectList} />
      <QuantityPickerModal
        isOpen={showQuantity}
        onClose={() => setShowQuantity(false)}
        confirming={adding}
        onConfirm={(quantity) => {
          if (selectedListId && productData) {
            addToList({ listId: selectedListId, productId: productData.product.id, quantity });
          }
        }}
      />
    </VStack>
  );
}
