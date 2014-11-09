var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var sass        = require('gulp-sass');
var connect     = require('connect');
var del         = require('del');
var path        = require('path');
var serveStatic = require('serve-static');

var join = path.join;

// Locations where files are stored. Commonly used with 'path.join' and a
// globbing pattern
var paths = {
  src: 'src',
  css: 'src/css',
  img: 'src/img',
  dest: 'build'
}

// These files don't need any pre-processing done to them. Generally just
// globbing file extensions.
var staticFiles = [
  'src/**/*.html'
];


// Cleaning
// =============================================================================

gulp.task('clean', function(callback) {
  del(paths.dest, callback);
});


// Building
// =============================================================================

gulp.task('styles', function() {
  return gulp.src(join(paths.css, '**/*.scss'), { base: paths.src })
    .pipe(sass({
      sourcemap: false,
      style: 'compressed'
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('images', function() {
  return gulp.src(join(paths.img, '**'), { base: paths.src })
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true
    }))
    .pipe(gulp.dest(paths.dest));
});

// Moving files that aren't processed by the above tasks.
gulp.task('move', function() {
  return gulp.src(staticFiles)
    .pipe(gulp.dest(paths.dest));
});


// Development
// =============================================================================

gulp.task('server', function() {
  var root = join(__dirname, paths.dest);

  connect()
    .use(serveStatic(root))
    .listen(80);
});

gulp.task('watch', function() {
  gulp.watch(join(paths.css, '**'), ['styles']);

  gulp.watch(join(paths.img, '**'), ['images']);

  gulp.watch(join(paths.src, '**/*.html'), ['move']);
});


// Tasks
// =============================================================================

gulp.task('build', [
  'styles',
  'images',
  'move'
]);

gulp.task('serve', [
  'build',
  'server',
  'watch'
]);

gulp.task('default', ['serve']);
