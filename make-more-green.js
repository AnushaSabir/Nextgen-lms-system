const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.git') || file.includes('.next')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('./src', function(err, results) {
  if (err) throw err;
  let count = 0;
  results.forEach(file => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts') && !file.endsWith('.css')) return;
    try {
      let content = fs.readFileSync(file, 'utf8');
      let original = content;

      // Replace #e3ecdf with #c8e6c9 (a bit more distinctly green)
      content = content.replace(/#e3ecdf/g, '#c8e6c9');
      
      if (file.endsWith('globals.css')) {
         content = content.replace(/--main-bg: #e3ecdf;/g, '--main-bg: #c8e6c9;');
      }

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated to more distinct green in: ${path.relative('./src', file)}`);
      }
    } catch(e) { /* skip */ }
  });
  console.log(`\nDone! Applied distinct light green theme to ${count} files.`);
});
