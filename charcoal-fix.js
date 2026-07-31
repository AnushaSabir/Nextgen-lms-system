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
      
      // 1. Background colors
      // We previously changed all dark backgrounds to bg-slate-50, then to bg-gray-200.
      content = content.replace(/bg-gray-200/g, 'bg-[#171717]');
      content = content.replace(/bg-slate-50/g, 'bg-[#171717]');
      content = content.replace(/bg-slate-100/g, 'bg-[#262626]'); // For cards / slightly elevated
      
      // 2. Text colors
      // Revert dark text classes back to light text classes suitable for charcoal
      content = content.replace(/text-slate-900/g, 'text-white');
      content = content.replace(/text-slate-800/g, 'text-gray-100');
      content = content.replace(/text-slate-700/g, 'text-gray-300');
      content = content.replace(/text-slate-600/g, 'text-gray-400');
      
      // Revert some inverted specific items
      content = content.replace(/border-slate-50/g, 'border-[#262626]');
      
      if (file.endsWith('globals.css')) {
          // Replace variables
          content = content.replace(/--main-bg: #e5e7eb;/g, '--main-bg: #171717;');
          content = content.replace(/--main-bg: #f3f4f6;/g, '--main-bg: #171717;');
          
          content = content.replace(/--card-bg: rgba\(255, 255, 255, 0\.7\);/g, '--card-bg: #262626;');
          content = content.replace(/--card-bg-active: rgba\(255, 255, 255, 0\.9\);/g, '--card-bg-active: #404040;');
          
          content = content.replace(/--pure-white: #334155;/g, '--pure-white: #ffffff;');
          content = content.replace(/--pure-black: #ffffff;/g, '--pure-black: #000000;');
          
          content = content.replace(/--light-gray-hover: #e2e8f0;/g, '--light-gray-hover: #404040;');
          content = content.replace(/--medium-gray-title: #0f172a;/g, '--medium-gray-title: #f3f4f6;');
          content = content.replace(/--body-gray-text: #475569;/g, '--body-gray-text: #a3a3a3;');
          content = content.replace(/--dark-gray-number: #94a3b8;/g, '--dark-gray-number: #f8fafc;');
          
          // Fix glass-navbar and glass-card
          content = content.replace(/background: rgba\(243, 244, 246, 0\.85\);/g, 'background: rgba(23, 23, 23, 0.85);');
          content = content.replace(/background: rgba\(255, 255, 255, 0\.7\);/g, 'background: rgba(38, 38, 38, 0.8);');
      }

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated to charcoal in ${file}`);
      }
    } catch(e) {
      // Ignore
    }
  });
  console.log(`Done. Modified ${count} files.`);
});
