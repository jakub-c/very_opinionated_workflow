var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');

var notifyError = function(err, lang) {
  process.stdout.write('------------------ error ------------------');
  process.stdout.write(err.toString());
  process.stdout.write('-------------------------------------------');
  notify.onError({
    title: lang + ' error',
    message: 'Check console',
    sound: 'Bass'
  })(err);
};

var AUTOPREFIXER_BROWSERS = [
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
  return gulp.src('app/sass/*.scss')
    .pipe(plumber(function() {
      this.emit('end');
    }))
    .pipe(sass({
      errLogToConsole: true
    }))
    .on('error', function(err) {
      notifyError(err, 'SASS');
    })
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.stream())
    .pipe(plumber.stop());
});
gulp.task('sass-dist', function() {
  return gulp.src('app/sass/*.scss')
    .pipe(sass({
      errLogToConsole: false
    }))
    .on('error', function(err) {
      notifyError(err, 'SASS');
    })
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'lint'], function() {
  browserSync.init({
    server: './app',
    open: false,
    ghostMode: false
  });
  gulp.watch('app/sass{,/**}', ['sass']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch(['app/js/**/*', './gulpfile.js'], ['lint'])
    .on('change', browserSync.reload);
});

gulp.task('lint', function() {
  return gulp.src(['app/js/*.js', './gulpfile.js'])
    .pipe(plumber())
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .on('error', function(err) {
      notifyError(err, 'JS Style');
    })
    .pipe(plumber.stop());
});

gulp.task('scripts', function() {

});

gulp.task('clean-dist', function(cb) {
  del('dist', cb);
});
gulp.task('copy-to-dist', function() {
  return gulp.src([
    'app/**/*', '!app/sass{,/**}', '!app/img{,/**}', '!app/js{,/**}'
  ],
  {base: './app'})
  .pipe(gulp.dest('dist'));
});
gulp.task('copy-images', function() {
  return gulp.src(['app/img/**/*'], {base: './app'})
    .pipe(imagemin())
    .pipe(gulp.dest('dist/'));
});
gulp.task('copy-js', function() {
  return gulp.src(['app/js/**/*'], {base: './app'})
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['serve']);
gulp.task('dist', function() {
  runSequence(
    'lint', 'clean-dist', 'sass-dist',
    'copy-to-dist', 'copy-images', 'copy-js'
  );
});
