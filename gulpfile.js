var gulp          = require('gulp');
var imagemin      = require('gulp-imagemin');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var deploy        = require('gulp-gh-pages');
var connect       = require('connect');
var del           = require('del');
var path          = require('path');
var serveStatic   = require('serve-static');

var join = path.join;

// Locations where files are stored. Commonly used with 'path.join' and a
// globbing pattern
var paths = {
  src: 'src',
  css: 'src/css',
  img: 'src/img',
  dest: 'build'
}

// These files don't need any pre-processing done to them. Primarily for copying
// html files.
var staticFiles = prepend(paths.src, [
  '**/*.html',
  'CNAME'
]);

/**
 * Prepend a path infront of a list of files.
 *
 * Example:

     prepend('src', ['index.html', '404.html']);

 * Returns an array containing 'src/index.html' and 'src/404.html'.
 */
function prepend(dir, files) {
  files.forEach(function(file, index) {
    files[index] = join(dir, file);
  });
  return files;
}


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
    .pipe(autoprefixer({
      browers: 'last 2 versions'
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


// Deployment
// =============================================================================

gulp.task('gh-pages', ['build'], function() {
  return gulp.src(join(paths.dest, '**/*'))
    .pipe(deploy());
});


// Tasks
// =============================================================================

gulp.task('build', [
  'clean',
  'styles',
  'images',
  'move'
]);

gulp.task('serve', [
  'build',
  'server',
  'watch'
]);

gulp.task('deploy', [
  'gh-pages'
]);

gulp.task('default', ['serve']);
