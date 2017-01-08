// page-tpl
const cname = 'page';

module.exports = {
  // Base info
  name: cname,
  title: cname,
  preview: '@layout',

  // Context
  context: {
    page: {
      bio: {
        title: { text: 'About' },
        type: 'featured',
        paragraph: {
          text: 'web designer lover of frontend&#8209;architecture design&#8209;systems and open&#8209;source',
        },
        linkList: {
          items: [
            { href: 'https://github.com/FrancisVega', title: 'Github', text: 'Github' },
            { href: 'https://dribbble.com/francis', title: 'Dribble', text: 'Dribbble' },
            { href: 'https://www.linkedin.com/in/francisvega', title: 'Linkedin', text: 'Linkedin' },
            { href: 'https://twitter.com/francis_vega', title: 'Twitter', text: 'Twitter' },
          ],
        },
      },
      future: {
        title: { text: 'Next' },
        paragraph: {
          text: 'elm-lang writting hardware',
        },
      },
    },
  },
};
