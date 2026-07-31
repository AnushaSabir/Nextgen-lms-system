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
      let originalContent = content;
      
      // Replace the too-white slate-50 with a more noticeable gray-200
      content = content.replace(/bg-slate-50/g, 'bg-gray-200');
      // Also catch any instances where they might be using slate-100 as well and want it darker
      content = content.replace(/bg-slate-100/g, 'bg-gray-200');
      
      if (file.endsWith('globals.css')) {
          content = content.replace(/--main-bg: #f3f4f6;/g, '--main-bg: #e5e7eb;');
      }

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated backgrounds to grey in ${file}`);
      }
    } catch(e) {
      // Ignore
    }
  });
  console.log(`Done. Modified ${count} files.`);
});
