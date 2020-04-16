// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true; // If «false» - Browsersync will work offline without internet connection

const { src, dest, parallel, series, watch } = require('gulp'),
	sass           = require('gulp-sass'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify');

let forProd = [
	'/**',
	' * @author Alexsab.ru',
	' */',
	''].join('\n');

let base = {
	app_name: 'app',
}

let port = 8000;

let projects = {
	
	app_name: {

		port: ++port,

		base: base.app_name,
		dest: base.app_name,

		styles: {
			src:    base.app_name + '/' + preprocessor + '/style.'+preprocessor,
			watch:    base.app_name + '/' + preprocessor + '/**/*.'+preprocessor,
			dest:   base.app_name + '/css',
			output: 'styles.css',
		},

		scripts: {
			src: [
				base.app_name + '/js/some-libs-file.js',
				base.app_name + '/js/script.js', // Custom scripts. Always at the end
			],
			dest:       base.app_name + '/js',
			output:     'scripts.min.js',
		},

		code: {
			src: [
				base.app_name  + '/**/*.{' + fileswatch + '}',
			],
		},

		forProd: [
			'/**',
			' * @author https://github.com/alexsab',
			' */',
			''].join('\n'),
	},

}


function defaultTask(cp) {
  // default task
  cp();
}

exports.default = defaultTask;






/* app_name BEGIN */

// Local Server
function app_name_browsersync() {
	connect.server({
		port: projects.app_name.port,
		base: projects.app_name.base,
	}, function (){
		browserSync.init({
			// server: { baseDir: projects.app_name.base + '/' },
			proxy: '127.0.0.1:' + projects.app_name.port,
			notify: false,
			online: online
		});
	});
};

// Custom Styles
function app_name_styles() {
	return src(projects.app_name.styles.src)
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.app_name.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.app_name.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts & JS Libraries
function app_name_scripts() {
	return src(projects.app_name.scripts.src)
	.pipe(concat(projects.app_name.scripts.output))
	// .pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.app_name.forProd))
	.pipe(dest(projects.app_name.scripts.dest))
	.pipe(browserSync.stream())
};

function app_name_watch() {
	watch(projects.app_name.styles.watch, app_name_styles);
	watch(projects.app_name.scripts.src, app_name_scripts);

	watch(projects.app_name.code.src).on('change', browserSync.reload);
};

exports.app_name = parallel(app_name_styles, app_name_scripts, app_name_browsersync, app_name_watch);

/* app_name END */

