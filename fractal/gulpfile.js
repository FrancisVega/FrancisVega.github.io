/*

    # GULPFILE
    docs: secuoyas.io/trunk/docs/gulpfile

*/

// Utils
const del = require('del');
const gulp = require('gulp');
const flatten = require('gulp-flatten');
const notify = require('gulp-notify');
const rename = require('gulp-rename');

// Javascript
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// CSS
const postcss = require('gulp-postcss');
const stylelint = require('gulp-stylelint');
const precss = require('precss');
const postcssCssnext = require('postcss-cssnext');
const postcssShort = require('postcss-short');
const lost = require('lost');
const postcssColorHexa = require('postcss-color-hexa');
const postcssEach = require('postcss-each');
const postcssEasyImport = require('postcss-easy-import');
const postcssMap = require('postcss-map');
const cssnano = require('gulp-cssnano');

// Fractal
const fractal = require('./fractal.js');
const logger = fractal.cli.console;

/* PATHS & FILE NAMES -------------------------------------------------------------------------- */
const src = `${__dirname}/src`;        // Carpeta source
const dist = `${__dirname}/dist`;      // Carpeta distribución
const appCss = 'app.css';              // Css donde se importan todos los demás
const appCssMin = 'main.css';          // Css final comprimido
const customJsMin = 'custom.min.js';   // Js comprimido de los custom scripts
const compJsMin = 'components.min.js'; // Js comprimido de todos los componentes
const customName = 'custom';           // Carpeta JS custom
const compsName = 'components';        // Carpeta JS componentes

const paths = {
  src: `${src}`,                                                 // Root
  dst: `${dist}`,                                                // Salida del 'build'
  public: `${src}/public`,                                       // Carpeta pública global (imgs, fuentes, ...)
  tokens: `${src}/tokens`,                                       // Tokens con valores / variables para front
  components: `${src}/components`,                               // Componentes
  public_css: `${src}/public/css`,                               // El css minificado
  public_images: `${src}/public/images`,                         // La carpeta de imágenes
  public_js: `${src}/public/js`,                                 // Donde escribiremos js global y librerías
  public_js_dist: `${src}/public/js-dist`,                       // Js final (minificado ...)
  public_js_es6: `${src}/public/js-es6`,                         // Carpeta temporal para procesar es6
  public_js_custom: `${src}/public/js/custom`,                   // Carpeta JS custom
  public_js_vendor: `${src}/public/js/vendor`,                   // Carpeta JS vendor
  public_js_dist_vendor: `${src}/public/js-dist/vendor`,         // Carpeta JS-DIST Vendor
  public_js_dist_custom: `${src}/public/js-dist/custom`,         // Carpeta JS-DIST Vendor
  public_js_dist_components: `${src}/public/js-dist/components`, // Carpeta JS-DIST Vendor
};

/* GLP NOTIFY FUNCTION ERROR ------------------------------------------------------------------- */
function errorCSS(error) {
  notify.onError({
    title: 'Gulp CSS', subtitle: 'CSS Error!', sound: 'Basso',
  })(error);
  this.emit('end');
}

/* CLEAN JSES6 DIRECTORY ----------------------------------------------------------------------- */
function cleanjsES6() {
  return del(`${paths.public_js_es6}`);
}

/* START THE FRACTAL SERVER -------------------------------------------------------------------- */
function fractalStart() {
  const server = fractal.web.server({ sync: true });
  server.on('error', (err) => { logger.error(err.message); });
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
}

/* RUN A STATIC EXPORT OF THE PROJECT WEB UI --------------------------------------------------- */
function fractalBuild() {
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => {
    logger.update(`Exported ${completed} of ${total} items`, 'info');
  });
  builder.on('error', (err) => { logger.error(err.message); });
  return builder.build().then(() => {
    logger.success('Fractal build completed!');
  });
}

/* STYLES -------------------------------------------------------------------------------------- */
function styles() {
  // Postcss plugins
  const processors = [
    postcssEach,
    postcssEasyImport({ glob: true }),
    postcssMap({
      maps: [
        `${paths.tokens}/media.json`,
        `${paths.tokens}/containers.json`,
        `${paths.tokens}/colors.json`,
        `${paths.tokens}/fonts.json`,
        `${paths.tokens}/spacing.json`,
      ],
    }),
    precss,
    postcssCssnext,
    postcssShort,
    lost,
    postcssColorHexa,
  ];

  // Process
  return gulp.src(`${paths.components}/${appCss}`)
    .pipe(postcss(processors))
    .on('error', errorCSS)
    .pipe(cssnano({ discardComments: { removeAll: true }, autoprefixer: false }))
    .pipe(rename(`${appCssMin}`))
    .pipe(gulp.dest(`${paths.public_css}`));
}

/* STYLE LINTING ------------------------------------------------------------------------------- */
function lintStyles() {
  logger.success('styles:lint Se ha ignorando el archivo reset.css');
  return gulp.src([
    `${paths.components}/**/*.css`,
    `!${paths.components}/00-config/reset.css`,
  ])
  .pipe(stylelint({
    failAfterError: false,
    reporters: [{
      formatter: 'string',
      console: true,
    }],
  }));
}

/* COPY IMAGES FROM COMPONENTS TO PUBLIC FOLDER ------------------------------------------------ */
function images() {
  return gulp.src(`${paths.components}/**/*.{jpg,png,gif,svg}`)
    .pipe(flatten())
    .pipe(gulp.dest(`${paths.public_images}`));
}

/* BABEL CUSTOM PUBLIC JS ---------------------------------------------------------------------- */
function babelCustom() {
  return gulp.src(`${paths.public_js_custom}/**/*.js`)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(`${paths.public_js_es6}/${customName}/`));
}

/* BABEL COMPONENTS JS ------------------------------------------------------------------------- */
function babelComp() {
  return gulp.src([
    `${paths.components}/**/**/*.js`,
    `!${paths.components}/**/**/*.config.js`,
  ])
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(`${paths.public_js_es6}/${compsName}/`));
}

/* CONCAT COMPONENTS JS ------------------------------------------------------------------------ */
function jsconcatComp() {
  return gulp.src([`${paths.public_js_es6}/${compsName}/**/*.js`])
    .pipe(concat(`${compJsMin}`))
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.public_js_dist_components}/`));
}

/* CONCAT CUSTOM JS ---------------------------------------------------------------------------- */
function jsconcatCustom() {
  return gulp.src([`${paths.public_js_es6}/${customName}/**/*.js`])
    .pipe(concat(`${customJsMin}`))
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.public_js_dist_custom}/`));
}

/* COPY VENDOR JS LIBS ------------------------------------------------------------------------- */
function jsCopyVendor() {
  return gulp.src([`${paths.public_js_vendor}/**/*.*`])
    .pipe(gulp.dest(`${paths.public_js_dist_vendor}/`));
}

/* COPY LIBS INSIDE NODE_MODULES */
function jsCopyToggly() {
  return gulp.src([`${__dirname}/node_modules/toggly/toggly.min.js`])
    .pipe(gulp.dest(`${paths.public_js_dist_vendor}/toggly`));
}

/* COMPILE JS TASKS JSE6 => JS => .MIN.JS ------------------------------------------------------ */
const compileComp = gulp.series(babelComp, jsconcatComp, cleanjsES6);
const compileCustom = gulp.series(babelCustom, jsconcatCustom, cleanjsES6);
const compileVendor = gulp.series(jsCopyToggly, jsCopyVendor, cleanjsES6);

/* WATCH --------------------------------------------------------------------------------------- */
function watch() {
  fractalStart();
  gulp.watch(`${paths.components}/**/*.css`, styles);
  gulp.watch(`${paths.components}/**/*.{jpg,png,svg,gif}`, images);
  gulp.watch(`${paths.components}/**/*.js`, compileComp);
  gulp.watch(`${paths.public_js_custom}/**/*.js`, compileCustom);
  gulp.watch(`${paths.tokens}/*.*`, compileComp);
  gulp.watch(`${paths.tokens}/*.*`, styles);
}

/* GULP ASKS ----------------------------------------------------------------------------------- */
const compile = gulp.series(styles, images, compileComp, compileCustom, compileVendor);
const lintcss = gulp.series(styles, lintStyles);
const build = gulp.series(compile, fractalBuild);

/* GULPAZO ------------------------------------------------------------------------------------- */
gulp.task('dev', gulp.series(compile, watch));
gulp.task('lint:css', lintcss);
gulp.task('build', build);
