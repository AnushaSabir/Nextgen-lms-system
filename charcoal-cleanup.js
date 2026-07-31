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
      
      // Clean up remaining light mode specific classes
      content = content.replace(/bg-slate-200\/50/g, 'bg-white/5');
      content = content.replace(/bg-slate-300\/50/g, 'bg-white/10');
      content = content.replace(/bg-slate-200/g, 'bg-[#262626]');
      content = content.replace(/border-slate-200/g, 'border-white/10');
      content = content.replace(/text-slate-500/g, 'text-gray-400');
      content = content.replace(/text-slate-400/g, 'text-gray-500');
      content = content.replace(/text-slate-600/g, 'text-gray-300');
      content = content.replace(/text-slate-700/g, 'text-gray-200');
      content = content.replace(/bg-slate-100/g, 'bg-[#171717]');
      content = content.replace(/text-slate-800/g, 'text-white');
      content = content.replace(/text-slate-900/g, 'text-white');
      
      // Specifically for Navbar
      content = content.replace(/background: rgba\(255, 255, 255, 0\.6\);/g, 'background: rgba(0, 0, 0, 0.6);');

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Cleaned up light classes in ${file}`);
      }
    } catch(e) {
      // Ignore
    }
  });
  console.log(`Done cleanup. Modified ${count} files.`);
});
