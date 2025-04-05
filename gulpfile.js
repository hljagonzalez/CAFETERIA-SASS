const { src, dest, watch, series, parallel } = require("gulp");
const sass = require ('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const autoprefixer  = require('autoprefixer')


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
 watch('src/scss/app.scss',css) // atento a cambios del archivo app.scss y si cambia vuelve a llamar a la función css
}
exports.css = css;
exports.dev = dev;
exports.default = series(css,dev); // Mejor series, para que compile primero, y luego se quede escuchando. La tarea con los
//watch siempre la última

//series -  lanza las tareas una detrás de otra, hasta que no termina una no empieza la otra
//parallel -  las lanza a la vez, no espera.