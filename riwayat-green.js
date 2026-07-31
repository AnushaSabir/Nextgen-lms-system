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

      // Replace main background colors with the Riwayat herbal green (#dae2cb)
      content = content.replace(/#f1f8e9/g, '#dae2cb');
      
      // Replace section backgrounds with a slightly darker/richer herbal green
      content = content.replace(/#dcedc8/g, '#c6d1b4');
      
      // The text is already a dark forest green (#1b5e20, #2e7d32, #388e3c, #43a047), 
      // but let's make it the exact dark teal/green from Riwayat (#133937) for the primary text
      content = content.replace(/#1b5e20/g, '#133937');
      content = content.replace(/#2e7d32/g, '#184745');
      content = content.replace(/#388e3c/g, '#246360');

      // Make buttons the dark herbal color as well, or keep them bright green?
      // Riwayat uses dark green for buttons mostly. Let's make primary buttons dark green #133937
      content = content.replace(/#4caf50/g, '#133937');
      content = content.replace(/#81c784/g, '#246360');

      if (file.endsWith('globals.css')) {
        content = content.replace(/--main-bg: #f1f8e9;/g, '--main-bg: #dae2cb;');
      }

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated to Riwayat Green in: ${path.relative('./src', file)}`);
      }
    } catch(e) { /* skip */ }
  });
  console.log(`\nDone! Applied Riwayat Green theme to ${count} files.`);
});
