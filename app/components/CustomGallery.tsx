import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ArrowLeft } from "lucide-react-native";

interface Photo {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  mediaType: string;
  creationTime: number;
}

interface CustomGalleryScreenProps {
  onSelect: (imageData: {
    uri: string;
    width: number;
    height: number;
    fileName: string;
    fileSize: number;
    type: string;
    mimeType: string;
  }) => void;
  onBack: () => void;
}

export default function CustomGalleryScreen({
  onSelect,
  onBack,
}: CustomGalleryScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  const fetchPhotos = useCallback(
    async (after: string | null = null) => {
      if (!permission?.granted) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Cannot access media library.");
          return;
        }
      }

      if (isLoading || !hasNextPage) return;

      setIsLoading(true);

      try {
        const assets = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          first: 50,
          after: after || undefined,
          sortBy: [["creationTime", false]],
        });

        setPhotos((prev) => [...prev, ...assets.assets]);
        setHasNextPage(assets.hasNextPage);
        setEndCursor(assets.endCursor);
      } catch (error) {
        console.error("Error fetching photos:", error);
        Alert.alert("Error", "Failed to load photos");
      } finally {
        setIsLoading(false);
      }
    },
    [permission, isLoading, hasNextPage]
  );

  const handleImageSelect = async (photo: Photo) => {
    if (isSelecting) return;

    setIsSelecting(true);

    try {
      let finalUri = photo.uri;
      let fileSize = 0;

      // Convert asset:// or ph:// URLs to file:// URLs
      if (photo.uri.startsWith("ph://") || photo.uri.startsWith("asset://")) {
        // Get asset info to get the actual file URI
        const assetInfo = await MediaLibrary.getAssetInfoAsync(photo.id);

        if (assetInfo.localUri) {
          finalUri = assetInfo.localUri;
        } else {
          // If no local URI, copy to cache directory
          const fileName = photo.filename || `image_${Date.now()}.jpg`;
          const cacheUri = `${FileSystem.cacheDirectory}${fileName}`;

          // Copy the asset to cache directory
          await FileSystem.copyAsync({
            from: photo.uri,
            to: cacheUri,
          });

          finalUri = cacheUri;
        }

        // Get file size
        try {
          const fileInfo = await FileSystem.getInfoAsync(finalUri);
          if (fileInfo.exists && "size" in fileInfo) {
            fileSize = fileInfo.size;
          }
        } catch (error) {
          console.warn("Could not get file size:", error);
        }
      }

      // Create ImagePickerAsset-like object
      const imageData = {
        uri: finalUri,
        width: photo.width,
        height: photo.height,
        fileName: photo.filename || `image_${Date.now()}.jpg`,
        fileSize,
        type: "image" as const,
        mimeType: photo.mediaType === "photo" ? "image/jpeg" : "image/jpeg",
      };

      onSelect(imageData);
    } catch (error) {
      console.error("Error processing selected image:", error);
      Alert.alert("Error", "Failed to process selected image");
    } finally {
      setIsSelecting(false);
    }
  };

  useEffect(() => {
    if (permission?.granted) {
      fetchPhotos();
    }
  }, [permission?.granted]);

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      onPress={() => handleImageSelect(item)}
      className="m-1 w-[32%] aspect-square relative"
      disabled={isSelecting}
    >
      <Image
        source={{ uri: item.uri }}
        className="w-full h-full "
        resizeMode="cover"
      />
      {isSelecting && (
        <View className="absolute inset-0 bg-black/20 rounded-lg items-center justify-center">
          <ActivityIndicator size="small" color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!isLoading && hasNextPage && endCursor) {
      fetchPhotos(endCursor);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <Text className="text-white text-lg text-center mb-4">
          We need permission to access your photos
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pt-3 px-2">
      <View className="mx-4 flex-row items-center justify-between bg-white rounded-lg h-14 px-2">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 justify-center items-center"
          disabled={isSelecting}
        >
          <ArrowLeft size={20} color={isSelecting ? "#999" : "black"} />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-black text-base font-semibold">
            {isSelecting ? "Processing..." : "Gallery"}
          </Text>
        </View>
      </View>

      <View className="flex-1 mt-4 bg-gray-100 py-5 px-2 rounded-3xl">
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#555" />
                <Text className="text-gray-600 mt-2">
                  Loading more photos...
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}
