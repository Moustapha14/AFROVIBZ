/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4k': '2560px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        'xs': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.25rem' }],
        'sm': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5rem' }],
        'base': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.75rem' }],
        'lg': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.75rem' }],
        'xl': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '2rem' }],
        '2xl': ['clamp(1.5rem, 5vw, 1.875rem)', { lineHeight: '2.25rem' }],
        '3xl': ['clamp(1.875rem, 6vw, 2.25rem)', { lineHeight: '2.5rem' }],
        '4xl': ['clamp(2.25rem, 7vw, 3rem)', { lineHeight: '1' }],
        '5xl': ['clamp(3rem, 8vw, 3.75rem)', { lineHeight: '1' }],
        '6xl': ['clamp(3.75rem, 10vw, 4.5rem)', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'mobile': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'mobile-elevated': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      minHeight: {
        'screen-mobile': '100dvh',
        'screen-safe': 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      maxWidth: {
        'mobile': '100vw',
        'content': '1200px',
        'wide': '1400px',
      },
      aspectRatio: {
        'mobile': '9/16',
        'tablet': '4/3',
        'desktop': '16/9',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      // Utilitaires personnalisés pour Mobile First
      const newUtilities = {
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.safe-area-padding': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.overscroll-contain': {
          'overscroll-behavior': 'contain',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
      }
      addUtilities(newUtilities)

      // Composants personnalisés pour Mobile First
      const components = {
        '.mobile-container': {
          width: '100%',
          maxWidth: '100vw',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen md': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen lg': {
            paddingLeft: '2.5rem',
            paddingRight: '2.5rem',
          },
        },
        '.mobile-button': {
          minHeight: '44px',
          minWidth: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          borderRadius: '0.5rem',
          transition: 'all 0.2s ease-in-out',
          touchAction: 'manipulation',
          '-webkit-tap-highlight-color': 'transparent',
          '@screen sm': {
            padding: '0.875rem 1.25rem',
            fontSize: '1rem',
          },
        },
        '.mobile-card': {
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '@screen sm': {
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        '.mobile-input': {
          width: '100%',
          minHeight: '44px',
          padding: '0.75rem 1rem',
          fontSize: '16px', // Empêche le zoom sur iOS
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: '#000',
            boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
          },
          '@screen sm': {
            padding: '0.875rem 1.25rem',
          },
        },
        '.mobile-grid': {
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          '@screen sm': {
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          },
          '@screen md': {
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          },
          '@screen lg': {
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          },
        },
        '.mobile-aspect-square': {
          aspectRatio: '1 / 1',
          width: '100%',
          height: 'auto',
        },
        '.mobile-aspect-video': {
          aspectRatio: '16 / 9',
          width: '100%',
          height: 'auto',
        },
        '.mobile-aspect-mobile': {
          aspectRatio: '9 / 16',
          width: '100%',
          height: 'auto',
        },
      }
      addComponents(components)
    }
  ],
}

