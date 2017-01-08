/**
  * Configure a Fractal instance.
  *
  * This configuration could also be done in a separate file, provided that this file.
  * Then imported the configured fractal instance from it to work with in your
  * Gulp tasks.
  * i.e. const fractal = require('./my-fractal-config-file');
 */

const fractal = require('@frctl/fractal').create();
const markedMod = require('marked');

const paths = {
  build: `${__dirname}/www`,
  src: `${__dirname}/src'`,
  static: `${__dirname}/tmp`,
};

const mandelbrot = require('@frctl/mandelbrot')({
  lang: 'en-gb',
  skin: 'black',
  nav: ['docs', 'components'],
  static: {
    mount: 'fractal',
  },
});

const nunjucks = require('@frctl/nunjucks')({

  filters: {

    RANDOMQUOTE: (str, minWords) => {
      const words = str.split(/\s/g);
      const wordCount = words.length;
      const randomWordCount = Math.round((Math.random() * (wordCount - minWords)) + (minWords));
      const offsetRandom = wordCount - randomWordCount;
      const finalOffset = Math.round(Math.random() * offsetRandom);
      const finalSlice = words.slice(finalOffset, randomWordCount + finalOffset);
      const finalJoin = finalSlice.join(' ');
      return finalJoin[0].toUpperCase() + finalJoin.slice(1);
    },

    CHARCOUNT: str => str.length,

    SLICE: (str, start, end) => {
      if (end === undefined) {
        end = str.length;
      }
      return str.slice(start, end);
    },

    HTMLDATA: (datas) => {
      let dataString = '';
      const objectKeys = Object.keys(datas);
      for (let i = 0; i < objectKeys.length; i += 1) {
        dataString += `data-${objectKeys[i]}="${datas[objectKeys[i]]}"`;
      }
      return dataString.trim();
    },

    BEMCSS: (classes) => {

      if (classes === undefined) {
        return;
      }

      let modifiers = '';
      let others = '';

      if (classes.mods !== undefined) {
        if (classes.mods.length > 0) {
          modifiers = classes.mods.map(mod => `${classes.block}--${mod}`).join(' ');
        }
      }

      if (classes.others !== undefined) {
        if (classes.others.length > 0) {
          others = classes.others.join(' ');
        }
      }

      return `${modifiers} ${others}`.replace(/\s+/g, ' ').trim();
    },

    is_string: obj => typeof obj === 'string',

    markdown: markedMod,

  },

  paths: [`${paths.static}/assets/vectors`],

});

// Project config
fractal.set('project.title', 'Secuoyas App Store Pattern Library');

// Components config
fractal.components.engine(nunjucks);
fractal.components.set('default.preview', '@preview');
fractal.components.set('default.status', 'prototype');
fractal.components.set('ext', '.nun');
fractal.components.set('path', `${__dirname}/src/components`);
fractal.components.set('title', 'Componentes');

// Docs config
fractal.docs.set('path', `${__dirname}/src/docs`);
fractal.docs.engine(nunjucks);
fractal.docs.set('ext', '.md');
fractal.docs.set('title', 'Documentación');

// Web UI config
fractal.web.theme(mandelbrot);
fractal.web.set('static.path', `${__dirname}/src/public`);
fractal.web.set('builder.dest', `${__dirname}/build`);

/*
 *fractal.web.set('server.syncOptions', {
 *  open: true,
 *})
 */

// fractal.web.set('builder.urls.ext', null);

// Export config
module.exports = fractal;
