"use strict";

/* параметры для gulp-cleas-css */
const minifyCssOptions = {
  debug: true,
  compatibility: "ie8",
  level: {
    1: {
      specialComments: 0,
      removeEmpty: true,
      removeWhitespace: true
    },
    2: {
      mergeMedia: true,
      removeEmpty: true,
      removeDuplicateFontRules: true,
      removeDuplicateMediaBlocks: true,
      removeDuplicateRules: true,
      removeUnusedRules: false
    }
  }
};

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
const path = {
  build: {
    html: "assets/build/",
    js: "assets/build/js/",
    css: "assets/build/css/",
    img: "assets/build/img/",
    fonts: "assets/build/fonts/"
  },
  src: {
    html: "assets/src/*.html",
    js: "assets/src/js/main.js",
    style: "assets/src/style/main.scss",
    img: "assets/src/img/**/*.*",
    fonts: "assets/src/fonts/**/*.*",
    manifest: "assets/src/img/favicon/manifest.json",
    service: "assets/src/sw.js"
  },
  watch: {
    html: "assets/src/**/*.html",
    js: "assets/src/js/**/*.js",
    css: "assets/src/style/**/*.scss",
    img: "assets/src/img/**/*.*",
    fonts: "assets/srs/fonts/**/*.*",
    manifest: "assets/src/img/favicon/manifest.json",
    service: "assets/src/sw.js"
  },
  clean: "./assets/build/*"
};

/* настройки сервера */
const config = {
  server: {
    baseDir: "./assets/build"
  },
  notify: true
};

/* подключаем gulp и плагины */
const gulp = require("gulp"), // подключаем Gulp
  webserver = require("browser-sync"), // сервер для работы и автоматического обновления страниц
  plumber = require("gulp-plumber"), // модуль для отслеживания ошибок
  rigger = require("gulp-rigger"), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require("gulp-sourcemaps"), // модуль для генерации карты исходных файлов
  sass = require("gulp-sass"), // модуль для компиляции SASS (SCSS) в CSS
  autoprefixer = require("gulp-autoprefixer"), // модуль для автоматической установки автопрефиксов
  cleanCSS = require("gulp-clean-css"), // плагин для минимизации CSS
  uglify = require("gulp-uglify-es").default, // модуль для минимизации JavaScript
  cache = require("gulp-cache"), // модуль для кэширования
  imagemin = require("gulp-imagemin"), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
  jpegrecompress = require("imagemin-jpeg-recompress"), // плагин для сжатия jpeg
  mozjpeg = require("imagemin-mozjpeg"), // плагин для сжатия jpeg
  gifsicle = require("imagemin-gifsicle"), // плагин для сжатия gif
  svgo = require("imagemin-svgo"), // плагин для сжатия svg
  optipng = require("imagemin-optipng"), // плагин для сжатия png
  pngquant = require("imagemin-pngquant"), // плагин для сжатия png
  rimraf = require("gulp-rimraf"), // плагин для удаления файлов и каталогов
  rename = require("gulp-rename");

/* задачи */

// запуск сервера
gulp.task("webserver", () => webserver(config));

// сбор html
gulp.task(
  "html:build",
  () =>
    gulp
      .src(path.src.html) // выбор всех html файлов по указанному пути
      .pipe(plumber()) // отслеживание ошибок
      .pipe(rigger()) // импорт вложений
      .pipe(gulp.dest(path.build.html))
      .pipe(webserver.reload({ stream: true })) // перезагрузка сервера
);

// сбор стилейnp
gulp.task(
  "css:build",
  () =>
    gulp
      .src(path.src.style) // получим main.scss
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(sass()) // scss -> css
      .pipe(sourcemaps.init()) // инициализируем sourcemap
      .pipe(autoprefixer())
      .pipe(cleanCSS({ format: "beautify" }))
      .pipe(gulp.dest(path.build.css))
      .pipe(rename({ suffix: ".min" }))
      .pipe(cleanCSS(minifyCssOptions)) // минимизируем CSS
      .pipe(sourcemaps.write("./")) // записываем sourcemap
      .pipe(gulp.dest(path.build.css)) // выгружаем в build
      .pipe(webserver.reload({ stream: true })) // перезагрузим сервguер
);

// сбор js
gulp.task(
  "js:build",
  () =>
    gulp
      .src(path.src.js) // получим файл main.js
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(rigger()) // импортируем все указанные файлы в main.js
      .pipe(gulp.dest(path.build.js))
      .pipe(rename({ suffix: ".min" }))
      .pipe(sourcemaps.init()) //инициализируем sourcemap
      .pipe(uglify()) // минимизируем js
      .pipe(sourcemaps.write("./")) //  записываем sourcemap
      .pipe(gulp.dest(path.build.js)) // положим готовый файл
      .pipe(webserver.reload({ stream: true })) // перезагрузим сервер
);

// перенос шрифтов
gulp.task("fonts:build", () =>
  gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts))
);

// перенос манифеста и сервис воркера
gulp.task("manifest:build", () => 
  gulp.src(path.src.manifest)
      .pipe(gulp.dest(path.build.html)));

gulp.task("sw:build", () => 
  gulp.src(path.src.service)
      .pipe(gulp.dest(path.build.html)));

gulp.task("image:build", () =>
  gulp
    .src(path.src.img)
    .pipe(plumber())
    .pipe(
      cache(
        imagemin(
          [
            gifsicle({ interlaced: true }),
            jpegrecompress({
              progressive: true,
              loops: 5,
              min: 70,
              max: 80,
              quality: "medium"
            }),
            mozjpeg({ quality: 75 }),
            svgo({ plugins: [{ removeViewBox: true }] }),
            optipng({ optimizationLevel: 3 }),
            pngquant({ speed: 5, min: 65, max: 75 })
          ],
          { verbose: false }
        )
      )
    )
    .pipe(gulp.dest(path.build.img))
);

// удаление каталога build
gulp.task("clean:build", () =>
  gulp.src(path.clean, { read: false }).pipe(rimraf())
);

// очистка кэша
gulp.task("cache:clear", () => cache.clearAll());

// сборка
gulp.task(
  "build",
  gulp.series(
    "clean:build",
    gulp.parallel("html:build", "js:build", "fonts:build", "image:build", "manifest:build", "sw:build"),
    "css:build"
  )
);

// запуск задач при изменении файлов
gulp.task("watch", () => {
  gulp.watch(path.watch.html, gulp.series("html:build"));
  gulp.watch(path.watch.css, gulp.series("css:build"));
  gulp.watch(path.watch.js, gulp.series("js:build"));
  gulp.watch(path.watch.fonts, gulp.series("fonts:build"));
  gulp.watch(path.watch.img, gulp.series("image:build"));
  gulp.watch(path.watch.manifest, gulp.series("manifest:build"));
  gulp.watch(path.watch.service, gulp.series("sw:build"));
});

// задача по умолчанию
gulp.task("default", gulp.series("build", gulp.parallel("webserver", "watch")));
