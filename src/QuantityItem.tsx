import * as React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface Props {
  isSelected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  isEnabled: boolean;
}

export const QuantityItem = ({
  isSelected,
  onPress,
  children,
  isEnabled,
}: Props) => {
  const myVal = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    if (isEnabled) {
      myVal.value = withTiming(isSelected ? 1 : 0, { duration: 400 });
    } else {
      myVal.value = isSelected ? 1 : 0;
    }
  }, [isSelected, myVal, isEnabled]);

  const selectedStyle = useAnimatedStyle(
    () => ({
      opacity: myVal.value,
    }),
    []
  );

  const notSelectedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(myVal.value, [0, 1], [1, 0]),
    }),
    []
  );

  return (
    <Pressable style={styles.quantityButton} onPress={onPress}>
      <Reanimated.View
        style={[styles.quantityItem, styles.selectedQuantity, selectedStyle]}
      >
        <Text style={styles.selectedQuantityText}>{children}</Text>
      </Reanimated.View>
      <Reanimated.View
        style={[
          styles.quantityItem,
          styles.notSelectedQuantity,
          notSelectedStyle,
        ]}
      >
        <Text style={styles.notSelectedQuantityText}>{children}</Text>
      </Reanimated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  quantityButton: {
    height: 50,
    width: 50,
    marginHorizontal: 10,
  },
  quantityItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityOptions: {
    flexDirection: 'row',
  },
  selectedQuantity: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2E8B57',
    borderRadius: 10,
  },
  notSelectedQuantity: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderRadius: 10,
    borderWidth: 2,
  },
  selectedQuantityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  notSelectedQuantityText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
