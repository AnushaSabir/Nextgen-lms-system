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

walk('.', function(err, results) {
  if (err) throw err;
  let count = 0;
  results.forEach(file => {
    // skip this script itself, images, fonts, binaries etc.
    if (file.endsWith('rename.js') || file.endsWith('.png') || file.endsWith('.mp4') || file.endsWith('.ico') || file.includes('package-lock.json')) {
      return;
    }
    try {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('GrapeTask') || content.includes('grapetask') || content.includes('Grapetask')) {
        let newContent = content
            .replace(/GrapeTask/g, 'NextGen-LMS')
            .replace(/grapetask/g, 'nextgen-lms')
            .replace(/Grapetask/g, 'Nextgen-lms');
        fs.writeFileSync(file, newContent, 'utf8');
        count++;
        console.log(`Replaced in ${file}`);
      }
    } catch(e) {
      // Ignore binary files or unreadable files
    }
  });
  console.log(`Done. Modified ${count} files.`);
});
