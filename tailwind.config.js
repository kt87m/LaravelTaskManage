const plugin = require('tailwindcss/plugin');

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ['./resources/ts/**/*.tsx'],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['hover', 'group-hover', 'checked', 'focus', 'focus-checked'],
    borderColor: ['hover', 'checked', 'focus'],
    textColor: ['focus', 'focus-within'],
    boxShadow: ['hover', 'group-hover'],
  },
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('focus-checked', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`focus-checked${separator}${className}`)}:focus:checked`
        })
      })
    })
  ],
}
