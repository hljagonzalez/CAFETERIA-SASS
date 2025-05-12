const { src, dest, watch, series, parallel } = require("gulp");
const sass = require ('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const autoprefixer  = require('autoprefixer')

const imagemin = require("gulp-imagemin");

const webp = require("gulp-webp");

const avif = require("gulp-avif");

function versionAvif() {
 return src("src/img/**/*.{png,jpg}")
   .pipe(avif())
   .pipe(dest("build/img"));
}

function versionWebp() {
 const opciones = {
   quality: 50 //quality es la calidad de la imagen, 50 es un valor intermedio.
 }
 return src("src/img/**/*.{png,jpg}") //sólo quiero convertir a webp las imágenes png y jpg
   .pipe(webp(opciones))
   .pipe(dest("build/img"));
}

//Si no quiero usar el done cómo parámetro, puedo hacerlo así usando return, pero no puedo usar done y return a la vez.
function imagenes() {
 return src("src/img/**/*")
  // IMPORTANTE. LA TAREA DE OPTIMIZACIÓN ANTES DE LA TAREA DE COPIAR LA IMAGEN EN BUILD.
   .pipe(imagemin({optimizationLevel: 3})) 
   //imagemin es un plugin que optimiza las imágenes, optimizationLevel: 3 es el nivel de optimización, 3 es el máximo.
   .pipe(dest("build/img"));
}

function css(done) {
 //compilar sass
 //pasos: 1 - identificar archivo, 2 - Compilarla, 3 - Guardar el .css
 src('src/scss/app.scss')
   .pipe(sass())
   //.pipe(sass({outputStyle: 'compressed'})) // con esto le decimos que queremos que el css nos lo haga comprimido, que ocupe lo mínimo
   .pipe(postcss([autoprefixer()])) // para dar soporte a navegadores antiguos que he tenido que especificar en el package.json
   .pipe(dest('build/css')) // este es el archivo que debe compilar
   done();
}
function dev(){
 watch('src/scss/**/*.scss',css) // atento a cambios en cualquier archivo .scss incluido en cualquier carpeta dentro de la carpeta 'src/scss'
 watch("src/img/**/*", imagenes);
}
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;

exports.default = series( css, dev); // Mejor series, para que compile primero, y luego se quede escuchando. La tarea con los
//watch siempre la última

//series -  lanza las tareas una detrás de otra, hasta que no termina una no empieza la otra
//parallel -  las lanza a la vez, no espera.