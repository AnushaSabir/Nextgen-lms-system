import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        mainBg: 'var(--main-bg)',
        cardBg: 'var(--card-bg)',
        cardBgActive: 'var(--card-bg-active)',
        primaryOrange: 'var(--primary-orange)',
        primaryBlue: 'var(--primary-blue)',
        neonRed: 'var(--neon-red)',
        secondaryBlueBlur: 'var(--secondary-blue-blur)',
        pureWhite: 'var(--pure-white)',
        pureBlack: 'var(--pure-black)',
        lightGrayHover: 'var(--light-gray-hover)',
        mediumGrayTitle: 'var(--medium-gray-title)',
        bodyGrayText: 'var(--body-gray-text)',
        darkGrayNumber: 'var(--dark-gray-number)',
        lightBorder: 'var(--light-border)',
        mediumBorder: 'var(--medium-border)',
        orangeBorderActive: 'var(--orange-border-active)',
        blueBorderActive: 'var(--blue-border-active)',
      },
      backgroundColor: {
        mainBg: 'var(--main-bg)',
        cardBg: 'var(--card-bg)',
        cardBgActive: 'var(--card-bg-active)',
        primaryOrange: 'var(--primary-orange)',
        primaryBlue: 'var(--primary-blue)',
        neonRed: 'var(--neon-red)',
        secondaryBlueBlur: 'var(--secondary-blue-blur)',
      },
      borderColor: {
        lightBorder: 'var(--light-border)',
        mediumBorder: 'var(--medium-border)',
        orangeBorderActive: 'var(--orange-border-active)',
        blueBorderActive: 'var(--blue-border-active)',
      },
    },
  },
  plugins: [],
};

export default config;
