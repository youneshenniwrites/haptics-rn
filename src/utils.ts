import { Dimensions } from 'react-native';

export const wait = (numMs: number | undefined) =>
  new Promise<void>((res) => setTimeout(() => res(), numMs));

export const { width } = Dimensions.get('window');
