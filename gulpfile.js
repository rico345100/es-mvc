"use strict";
const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const browserifyCss = require('browserify-css');
const stringify = require('stringify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

const SRC = './src';
const DIST = './dist';

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['html', 'script', 'style']);

gulp.task('html', () => {
	return gulp.src(`${SRC}/html/index.html`)
	.pipe(fileInclude('@@'))
	.pipe(gulp.dest(`${DIST}/html`));
});

gulp.task('script', () => {
	return browserify({
		entries: [`${SRC}/js/index.js`],
		paths: [
			'./node_modules', 
			'./components/js', 
			'/components/css', 
			'./src/js', 
			'./src/css',
			'./src/html'
		]
	})
	.transform(babelify, { 
		presets: ["es2015"],
	})
	.transform(browserifyCss, { global: true })
	.transform(stringify, {
		appliesTo: {
			includeExtensions: ['.html', '.tpl']
		}
	})
	.bundle()
	.pipe(source('index.js'))
	.pipe(buffer())
	.pipe(gulp.dest(`${DIST}/js`));
});

gulp.task('style', () => {
	return gulp.src(`${SRC}/css/app.css`)
	.pipe(gulp.dest(`${DIST}/css`))
	.pipe(browserSync.stream());
});

gulp.task('watch', () => {
	gulp.watch(`${SRC}/html/**`, ['html']);
	gulp.watch(`${SRC}/js/**`, ['script']);
	gulp.watch(`${SRC}/css/**`, ['style']);
});

gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: [`${DIST}/html`, `${DIST}`]
		}
	});

	gulp.watch(`${DIST}/html/**`).on('change', browserSync.reload);
	gulp.watch(`${DIST}/js/**`).on('change', browserSync.reload);
});