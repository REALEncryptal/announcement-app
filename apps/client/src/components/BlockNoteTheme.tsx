import {
  Theme,
  lightDefaultTheme,
  darkDefaultTheme
} from "@blocknote/mantine";

// Light theme that matches our application's color scheme
export const customLightTheme: Theme = {
  // Using colors that match our shadcn theme
  colors: {
    editor: {
      text: "#1f2937", // gray-800
      background: "#ffffff",
    },
    menu: {
      text: "#1f2937", // gray-800
      background: "#ffffff",
    },
    tooltip: {
      text: "#1f2937", // gray-800
      background: "#f3f4f6", // gray-100
    },
    hovered: {
      text: "#1f2937", // gray-800
      background: "#f3f4f6", // gray-100
    },
    selected: {
      text: "#ffffff",
      background: "#3b82f6", // blue-500
    },
    disabled: {
      text: "#9ca3af", // gray-400
      background: "#f3f4f6", // gray-100
    },
    shadow: "#d1d5db", // gray-300
    border: "#e5e7eb", // gray-200
    sideMenu: "#d1d5db", // gray-300
    
    // Use the default light theme's highlight colors but replace with our own color scheme
    highlights: {
      ...lightDefaultTheme.colors!.highlights,
      gray: {
        text: "#6B7280", // gray-500
        background: "#F3F4F6", // gray-100
      },
      blue: {
        text: "#2563EB", // blue-600
        background: "#DBEAFE", // blue-100
      },
      red: {
        text: "#DC2626", // red-600
        background: "#FEE2E2", // red-100
      },
      green: {
        text: "#16A34A", // green-600
        background: "#DCFCE7", // green-100
      },
      yellow: {
        text: "#CA8A04", // yellow-600
        background: "#FEF9C3", // yellow-100
      },
      purple: {
        text: "#7C3AED", // violet-600
        background: "#EDE9FE", // violet-100
      },
      pink: {
        text: "#DB2777", // pink-600
        background: "#FCE7F3", // pink-100
      },
    },
  },
  borderRadius: 6, // Matching the border-radius from your theme
  fontFamily: "\"Inter\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"Open Sans\", \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif",
};

// Dark theme that complements the light theme
export const customDarkTheme: Theme = {
  ...customLightTheme,
  colors: {
    ...customLightTheme.colors,
    editor: {
      text: "#f3f4f6", // gray-100
      background: "#1f2937", // gray-800
    },
    menu: {
      text: "#f3f4f6", // gray-100
      background: "#1f2937", // gray-800
    },
    tooltip: {
      text: "#f3f4f6", // gray-100
      background: "#374151", // gray-700
    },
    hovered: {
      text: "#f3f4f6", // gray-100
      background: "#374151", // gray-700
    },
    selected: {
      text: "#ffffff",
      background: "#3b82f6", // blue-500
    },
    disabled: {
      text: "#6b7280", // gray-500
      background: "#374151", // gray-700
    },
    shadow: "#111827", // gray-900
    border: "#374151", // gray-700
    sideMenu: "#f3f4f6", // gray-100
    
    // Use the default dark theme's highlight colors
    highlights: darkDefaultTheme.colors!.highlights,
  },
};

// Combined theme for BlockNote
export const blockNoteTheme = {
  light: customLightTheme,
  dark: customDarkTheme,
};
