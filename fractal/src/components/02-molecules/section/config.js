// bio
const cname = 'section';

module.exports = {
  // Base info
  name: cname,
  title: cname,
  collated: true,

  // Context
  context: {
    type: 'normal',
    list: true,
  },
  variants: [
    { name: 'featured', context: { type: 'featured' } },
    { name: 'hl', context: { type: 'hl' } },
  ],
};
