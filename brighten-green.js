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

      // Dull dark greens → Bright vibrant greens
      // Primary accent: dull #5a9e6f → bright #4caf50
      content = content.replace(/#5a9e6f/g, '#4caf50');
      // Deep: dull #3d7a54 → vivid #2e7d32
      content = content.replace(/#3d7a54/g, '#2e7d32');
      // Light: dull #7bbf8e → bright #81c784
      content = content.replace(/#7bbf8e/g, '#81c784');
      // Text forest: dull #1b5e20 → keep as is (it's fine for text)
      // Soft text: dull #4a7c59 → brighter #388e3c
      content = content.replace(/#4a7c59/g, '#388e3c');
      // Mid text: dull #6a9878 → brighter #43a047
      content = content.replace(/#6a9878/g, '#43a047');
      // Dull #7aaa88 → bright #66bb6a
      content = content.replace(/#7aaa88/g, '#66bb6a');
      // Background: too white #f0f7f0 → fresh bright mint #f1f8e9
      content = content.replace(/#f0f7f0/g, '#f1f8e9');
      // Section bg: dull #e8f5e8 → bright #dcedc8
      content = content.replace(/#e8f5e8/g, '#dcedc8');

      // rgba replacements for brighter greens
      content = content.replace(/rgba\(90,\s*158,\s*111,/g, 'rgba(76, 175, 80,');
      content = content.replace(/rgba\(61,\s*122,\s*84,/g, 'rgba(46, 125, 50,');
      content = content.replace(/rgba\(123,\s*191,\s*142,/g, 'rgba(129, 199, 132,');
      content = content.replace(/rgba\(240,\s*247,\s*240,/g, 'rgba(241, 248, 233,');

      if (file.endsWith('globals.css')) {
        content = content.replace(/--primary-orange:\s*#[0-9a-fA-F]+;/g, '--primary-orange: #4caf50;');
        content = content.replace(/--primary-blue:\s*#[0-9a-fA-F]+;/g, '--primary-blue: #2e7d32;');
        content = content.replace(/--main-bg:\s*#[0-9a-fA-F]+;/g, '--main-bg: #f1f8e9;');
        content = content.replace(/--body-gray-text:\s*#[0-9a-fA-F]+;/g, '--body-gray-text: #388e3c;');
      }

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Brightened: ${path.relative('./src', file)}`);
      }
    } catch(e) { /* skip */ }
  });
  console.log(`\nDone! Made ${count} files brighter.`);
});
