import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { imageUrl } from './src/constants';
import { QuantityItem } from './src/QuantityItem';
import { wait, width } from './src/utils';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const notificationSrc = require('./src/notification.wav');

export default function App() {
  const [isFavorite, setIsFavourite] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [cartCount, setCartCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSound, setSound] = React.useState<Audio.Sound>();
  const heartScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const [isEnabled, setIsEnabled] = React.useState(true);

  const handleAddToCart = React.useCallback(async () => {
    setIsLoading(true);

    if (isEnabled) {
      buttonScale.value = withTiming(0.9, { duration: 200 });
    }

    await wait(1000);

    if (isEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    setCartCount((val) => val + quantity);

    if (isEnabled) {
      buttonScale.value = withTiming(1, { duration: 200 });
    }

    setIsLoading(false);
  }, [buttonScale, quantity, isEnabled]);

  const handleSelectQuantity = React.useCallback(
    (newQuantity) => {
      setQuantity(newQuantity);

      if (isEnabled) {
        if (newQuantity === 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (newQuantity === 2) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    },
    [isEnabled]
  );

  const handleToggleFavourite = React.useCallback(async () => {
    setIsFavourite((val) => !val);

    if (isEnabled) {
      if (!isFavorite) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        heartScale.value = withSequence(
          withTiming(1.3, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
        playSound();
      }
    }
  }, [heartScale, isEnabled, isFavorite]);

  const playSound = React.useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(notificationSrc);
    setSound(sound);
    await sound.playAsync();
  }, []);

  React.useEffect(() => {
    // return currentSound ? () => currentSound.unloadAsync() : undefined;
    const clearSound = async () => {
      await currentSound?.unloadAsync();
    };
    return () => {
      clearSound();
    };
  }, [currentSound]);

  const heartStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: heartScale.value }],
    }),
    []
  );

  const buttonStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: buttonScale.value }],
      opacity: interpolate(buttonScale.value, [0.9, 1], [0.5, 1]),
    }),
    []
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <Image source={{ uri: imageUrl }} style={{ width, height: width }} />
      <View style={styles.favouriteContainer}>
        <Text style={styles.name}>Matcha Latte</Text>
        <ReanimatedPressable onPress={handleToggleFavourite} style={heartStyle}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={50}
            style={styles.favoriteIcon}
          />
        </ReanimatedPressable>
      </View>
      <View style={styles.content}>
        <View style={styles.quantity}>
          <View style={styles.quantityOptions}>
            {new Array(3).fill(null).map((_, index) => (
              <QuantityItem
                key={index}
                isSelected={index + 1 === quantity}
                isEnabled={isEnabled}
                onPress={() => handleSelectQuantity(index + 1)}
              >
                {index + 1}
              </QuantityItem>
            ))}
          </View>
        </View>
        <ReanimatedPressable
          style={[styles.cta, buttonStyle]}
          onPress={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.ctaText}>Add to cart!</Text>
          )}
        </ReanimatedPressable>
        <Text style={styles.cartCount}>Items in cart: {cartCount}</Text>
        <View style={styles.footer}>
          <Switch
            value={isEnabled}
            onValueChange={() => setIsEnabled((val) => !val)}
          />
          <Text>{isEnabled ? 'Disable' : 'Enable'} enhancements</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  favouriteContainer: {
    padding: 10,
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  favoriteIcon: {
    color: 'white',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  cta: {
    height: 45,
    justifyContent: 'center',
    width: width / 2,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FC7A57',
    borderRadius: 10,
    marginBottom: 30,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantity: {
    marginBottom: 30,
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomColor: '#E0E0E2',
    borderBottomWidth: 2,
  },
  quantityOptions: {
    flexDirection: 'row',
  },
  cartCount: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  footer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'space-between',
  },
});
