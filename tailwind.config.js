module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.pug'],
    preserveHtmlElements: false,
    mode: 'all',
    options: {
      keyframes: true,
      fontFace: true,
      variables: true,
    },
    corePlugins: {
      float: false,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
    appearance: [],
  },
  plugins: [],
};
