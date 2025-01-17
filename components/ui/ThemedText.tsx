import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'heading' | 'mediumSemiBold' | 'medium';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'heading' ? styles.heading : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'mediumSemiBold' ? styles.mediumSemiBold : undefined,
        type === 'medium' ? styles.medium : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontFamily:"regular",
  },
  defaultSemiBold: {
    fontSize: 14,
    fontFamily:"medium"
  },
  mediumSemiBold: {
    fontSize: 16,
    fontFamily:"medium"
  },
  medium: {
    fontSize: 16,
    fontFamily:"regular"
  },
  title: {
    fontSize: 32,
    fontFamily:"bold"
  },
  heading: {
    fontSize: 24,
    fontFamily:"bold"
  },
  subtitle: {
    fontSize: 20,
    fontFamily:"semi_bold"
  },
  link: {
    fontSize: 16,
    color: 'cyan',
  },
});
