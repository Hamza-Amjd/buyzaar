/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: "#01384a",
    secondary: "#cffcdb",
    tertiary: "#FF7754",
    gray: "rgba(84, 99, 87,0.5)",
    gray2: "#e6f7ea",
    white:"#FFFFFF",
    offWhite:"#F3F4F8",
    text: '#01384a',
    background: '#fff',
    background2: '#F3F4F8',
    background3: '#f1f1f1',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: "#1e8eb3",
    secondary: "#cffcdb",
    tertiary: "#FF7754",
    gray: "#acacac",
    gray2: "#e6f7ea",
    text: '#ECEDEE',
    background: '#151718',
    background2: '#192734',
    background3: '#22303c',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
