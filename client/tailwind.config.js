/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atmosphere Design System Palette
        atmosphere: {
          bg: '#E8EDF3',          // Primary soft blue-grey background
          sidebar: '#E3E9F0',     // Floating navigation & sidebar surfaces
          card: '#F4F7FA',        // Card surfaces & light panels
          surface: '#FFFFFF',     // Clean white raised surface
          border: '#DDE4EC',      // Borders & divider lines
          text: '#253142',        // Primary text
          muted: '#7C8998',       // Secondary & description text
          dim: '#A0ACBA',         // Muted labels & placeholders
          orange: '#2563EB',      // Primary Theme Blue
          orangeHover: '#1D4ED8', // Blue hover state
          orangeSoft: '#EFF6FF',  // Blue light pill/chip background
          orangeBorder: '#BFDBFE',// Blue light border
          well: '#E2E8F0',        // Recessed input / well background
          success: '#10B981',     // Soft modern green
          warning: '#F59E0B',     // Muted amber
          danger: '#EF4444',      // Soft red
        },
        navy: {
          950: '#0B0F19',
          900: '#101827',
          800: '#1E293B',
          700: '#334155',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB', // Map primary to Theme Blue
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        },
        silver: {
          50: '#F8FAFC',
          100: '#E8EDF3', // Mapped to Atmosphere BG
          200: '#DDE4EC', // Mapped to Atmosphere Border
          300: '#CBD5E1',
          400: '#A0ACBA', // Mapped to Atmosphere Dim
          500: '#7C8998', // Mapped to Atmosphere Muted
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#253142', // Mapped to Atmosphere Primary Text
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF782F',
          600: '#F56820',
          700: '#EA580C',
        },
      },
      boxShadow: {
        'atmo-card': '6px 6px 16px rgba(166, 175, 195, 0.35), -6px -6px 16px rgba(255, 255, 255, 0.9)',
        'atmo-card-sm': '3px 3px 10px rgba(166, 175, 195, 0.28), -3px -3px 10px rgba(255, 255, 255, 0.95)',
        'atmo-card-lg': '10px 10px 26px rgba(166, 175, 195, 0.4), -10px -10px 26px rgba(255, 255, 255, 1)',
        'atmo-card-hover': '8px 8px 22px rgba(166, 175, 195, 0.45), -8px -8px 22px rgba(255, 255, 255, 1)',
        'atmo-well': 'inset 2px 2px 5px rgba(166, 175, 195, 0.35), inset -2px -2px 5px rgba(255, 255, 255, 0.85)',
        'atmo-well-deep': 'inset 3px 3px 6px rgba(166, 175, 195, 0.45), inset -3px -3px 6px rgba(255, 255, 255, 0.95)',
        'atmo-btn': '3px 3px 8px rgba(166, 175, 195, 0.38), -3px -3px 8px rgba(255, 255, 255, 0.9)',
        'atmo-btn-active': 'inset 2px 2px 4px rgba(166, 175, 195, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.9)',
        'atmo-orange': '0 6px 20px -2px rgba(37, 99, 235, 0.42)',
        'atmo-sidebar': '6px 6px 20px rgba(166, 175, 195, 0.35), -4px -4px 16px rgba(255, 255, 255, 0.85)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
