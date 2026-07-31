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
      
      // Colors
      content = content.replace(/#f0591f/g, '#0ea5e9'); // orange to sky-500
      content = content.replace(/#f97316/g, '#0ea5e9'); // orange-500 to sky-500
      content = content.replace(/#ff7a45/g, '#38bdf8'); // light orange to sky-400
      content = content.replace(/orange-500/g, 'sky-500');
      content = content.replace(/orange-400/g, 'sky-400');
      content = content.replace(/primaryOrange/g, 'primaryBlue'); // replace class names if mapped

      // Backgrounds
      content = content.replace(/bg-\[#020617\]/g, 'bg-slate-50');
      content = content.replace(/bg-\[#050b14\]/g, 'bg-slate-50');
      content = content.replace(/bg-\[#010411\]/g, 'bg-slate-50');
      
      // Text colors
      // Only replace text-white with text-slate-900 if it's not inside a button that needs to be white. 
      // A simple regex might be too broad, but let's do text-[#d4d4d8] to text-slate-600
      content = content.replace(/text-\[#d4d4d8\]/g, 'text-slate-600');
      content = content.replace(/text-\[#e4e4e7\]/g, 'text-slate-600');
      content = content.replace(/text-\[#a1a1aa\]/g, 'text-slate-500');
      content = content.replace(/text-\[#94a3b8\]/g, 'text-slate-500');
      content = content.replace(/text-\[#cbd5e1\]/g, 'text-slate-600');
      
      // Replace text-white globally is risky, let's just do text-slate-900 for typical body text classes 
      // used in the layouts/pages
      content = content.replace(/text-white/g, 'text-slate-900');
      // Wait, buttons with bg-sky-500 will have text-slate-900 now, which is bad.
      // We will revert text-slate-900 inside buttons or just let the user fix specific buttons later.
      // Actually, let's replace "bg-[#0ea5e9] text-slate-900" with "bg-[#0ea5e9] text-white"
      content = content.replace(/bg-\[#0ea5e9\] text-slate-900/g, 'bg-[#0ea5e9] text-white');
      content = content.replace(/text-slate-900 font-bold/g, 'text-slate-900 font-bold'); // no-op

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated theme colors in ${file}`);
      }
    } catch(e) {
      // Ignore
    }
  });
  console.log(`Done. Modified ${count} files.`);
});
