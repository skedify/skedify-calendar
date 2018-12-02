import { css } from 'docz-plugin-css';

export default {
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: false,
    }),
  ],
  themeConfig: {
    logo: {
      src: 'https://skedify-logo.now.sh/',
      width: '80%',
    },
    colors: {
      primary: '#3A6DDF',
    },
    styles: {
      h1: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        fontWeight: 300,
      },
      container: {
        width: [1120, '100%', '100%'],
        padding: ['20px', '0 40px 40px'],
      },
    },
  },
};
