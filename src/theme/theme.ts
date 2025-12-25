import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// Define custom colors
const colors = {
    primary: '#6200ee',
    onPrimary: '#ffffff',
    secondary: '#03dac6',
    onSecondary: '#000000',
    background: '#f6f6f6',
    surface: '#ffffff',
    error: '#B00020',
};

const fontConfig = {
    fontFamily: 'System', // Use system font for now, can be updated to Google Fonts later
};

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...colors,
    },
    // fonts: configureFonts({config: fontConfig}), // Optional: customize fonts
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#bb86fc',
        onPrimary: '#000000',
        secondary: '#03dac6',
        onSecondary: '#000000',
        background: '#121212',
        surface: '#1e1e1e',
    },
};
