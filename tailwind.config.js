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
    backgroundColor: ['hover', 'group-hover', 'checked'],
    borderColor: ['hover', 'checked', 'focus'],
  },
  plugins: [],
}
