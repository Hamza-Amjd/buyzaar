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
    lineHeight: 16,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily:"poppins_medium"
  },
  mediumSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily:"poppins_medium"
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily:"poppins_medium"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily:"poppins_bold"
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily:"poppins_bold"
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily:"poppins_bold"
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: 'cyan',
  },
});
