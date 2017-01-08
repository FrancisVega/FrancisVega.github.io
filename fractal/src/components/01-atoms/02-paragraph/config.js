// bio
const cname = 'paragraph';

module.exports = {
  // Base info
  name: cname,
  title: cname,
  collated: true,

  // Context
  context: {
    text: 'Paragraph text lorem ipsum dolor sit amet lol jandler kaldner mandler todo locok',
  },

  // Variants
  variants: [
    {
      name: 'featured',
      context: {
        modifiers: ['featured'],
      },
    },
    {
      name: 'hl',
      context: {
        modifiers: ['hl'],
      },
    },
  ],
};
