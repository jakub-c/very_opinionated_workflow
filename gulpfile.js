'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var AUTOPREFIXER_BROWSERS = [
  '> 5%',
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  const sass = require('gulp-sass');
  const sourcemaps = require('gulp-sourcemaps');
  const argv = require('yargs').argv;
  const autoprefixer = require('gulp-autoprefixer');
  const gulpif = require('gulp-if');
  const notify = require('gulp-notify');

  let isDev;
  if (argv.production || process.env.PRODUCTION) {
    isDev = false;
  } else {
    isDev = true;
  }

  return gulp.src('source/sass/*.scss')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass({outputStyle: 'expanded'})
      .on('error', notify.onError(
        {message: 'There is a SASS error, please look the console for details'}
      ))
      .on('error', sass.logError)
    )
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(gulpif(isDev, sourcemaps.write('')))
    .pipe(gulp.dest('source/'))
    .pipe(browserSync.stream());
});

gulp.task('sass-lint', function() {
  const sassLint = require('gulp-sass-lint');
  const argv = require('yargs').argv;
  const isProduction = argv.production || false;
  const gulpif = require('gulp-if');
  const notify = require('gulp-notify');

  return gulp.src([
    '!source/sass/_variables.scss',
    '!source/sass/bootstrap/**/*',
    '!source/sass/general/**/*',
    '!source/sass/mixins/**/*',
    '!source/sass/libs/**/*',
    '!source/sass/_non-standard-props.scss',
    'source/sass/**/*.scss'
  ])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .on('error', notify.onError(
      {message: 'There is a JS error, please look the console for details'})
    )
    .pipe(gulpif(isProduction, sassLint.failOnError()));
});

gulp.task('js-lint', function() {
  const eslint = require('gulp-eslint');
  const argv = require('yargs').argv;
  const isProduction = argv.production || false;
  const gulpif = require('gulp-if');
  const notify = require('gulp-notify');

  return gulp.src(['source/js/*.js', '!source/js/main.bundled.js',
    './gulpfile.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .on('error', notify.onError(
        {message: 'There is a JS error, please look the console for details'})
      )
      .pipe(gulpif(isProduction, eslint.failAfterError()));
});

gulp.task('browserify', function() {
  const browserify = require('browserify');
  const rename = require('gulp-rename');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');
  const argv = require('yargs').argv;
  let browserifyDebug;
  if (argv.production) {
    browserifyDebug = false;
  } else {
    browserifyDebug = true;
  }

  return browserify({
    entries: './source/js/main.js',
    debug: browserifyDebug
  })
    .transform('babelify', {presets: ["es2015"]})
    .bundle()
    .pipe(source('./source/js/main.js'))
    .pipe(buffer())
    .pipe(rename({
      basename: 'main.bundled'
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean-dist', function() {
  const del = require('del');

  del.sync('dist');
});

// copy all files but the ones that need to go through
// additional minification
gulp.task('copy-files', function() {
  return gulp.src([
    'source/**/*', '!source/*.css', '!source/sass{,/**}',
    '!source/img{,/**}', '!source/js{,/**}'
  ],
  {base: './app'})
    .pipe(gulp.dest('dist'));
});
gulp.task('dist-images', function() {
  const imagemin = require('gulp-imagemin');

  return gulp.src(['source/img/**/*'], {base: './app'})
    .pipe(imagemin())
    .pipe(gulp.dest('dist/'));
});
gulp.task('dist-js', function() {
  const uglify = require('gulp-uglify');

  return gulp.src(['source/js/main.bundled.js', 'source/js/libs/**/*'],
    {base: './app'})
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist-css', function() {
  const cssnano = require('gulp-cssnano');

  return gulp.src('source/*.css')
    .pipe(cssnano({
      autoprefixer: {browsers: AUTOPREFIXER_BROWSERS}
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist', function() {
  const runSequence = require('run-sequence');

  runSequence(
    'sass-lint', 'js-lint', 'sass', 'browserify',
    'clean-dist', 'dist-css', 'dist-js', 'dist-images', 'copy-files'
  );
});

gulp.task('serve', ['sass', 'browserify', 'js-lint', 'sass-lint'], function() {
  browserSync.init({
    server: './app',
    open: false,
    ghostMode: false
  });
  gulp.watch('source/sass{,/**}', ['sass', 'sass-lint']);
  gulp.watch('source/*.html').on('change', browserSync.reload);
  gulp.watch(['source/js/**/*', './gulpfile.js'], ['browserify', 'js-lint']);
});

gulp.task('default', ['serve']);
