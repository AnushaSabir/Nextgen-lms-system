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

      // Replace current dull backgrounds with bright light green (#e3ecdf) from Riwayat
      content = content.replace(/#C8D9A8/g, '#e3ecdf');
      content = content.replace(/#A3B59B/g, '#e3ecdf');
      
      // I will also make the cards slightly lighter green/white so they pop on #e3ecdf
      // The current card color in some places might be different, but let's just stick to the background fix
      
      if (file.endsWith('globals.css')) {
         content = content.replace(/--main-bg: #C8D9A8;/g, '--main-bg: #e3ecdf;');
         content = content.replace(/--main-bg: #A3B59B;/g, '--main-bg: #e3ecdf;');
      }

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated to Riwayat Bright Light Green in: ${path.relative('./src', file)}`);
      }
    } catch(e) { /* skip */ }
  });
  console.log(`\nDone! Applied Riwayat Bright Light Green theme to ${count} files.`);
});
