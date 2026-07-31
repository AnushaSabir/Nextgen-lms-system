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

      // ── BACKGROUNDS ──────────────────────────────────────────
      // dark charcoal → soft mint white
      content = content.replace(/bg-\[#171717\]/g, 'bg-[#f0f7f0]');
      content = content.replace(/bg-\[#262626\]/g, 'bg-white');
      content = content.replace(/bg-\[#404040\]/g, 'bg-[#e8f5e8]');
      // sky-blue / cyan accents → sage green
      content = content.replace(/bg-\[#0ea5e9\]/g, 'bg-[#5a9e6f]');
      content = content.replace(/bg-\[#0284c7\]/g, 'bg-[#3d7a54]');
      content = content.replace(/bg-\[#38bdf8\]/g, 'bg-[#7bbf8e]');
      content = content.replace(/from-\[#0ea5e9\]/g, 'from-[#5a9e6f]');
      content = content.replace(/to-\[#0ea5e9\]/g, 'to-[#5a9e6f]');
      content = content.replace(/from-\[#0284c7\]/g, 'from-[#3d7a54]');
      content = content.replace(/to-\[#0284c7\]/g, 'to-[#3d7a54]');
      content = content.replace(/via-\[#38bdf8\]/g, 'via-[#7bbf8e]');
      content = content.replace(/to-\[#38bdf8\]/g, 'to-[#7bbf8e]');
      content = content.replace(/from-\[#38bdf8\]/g, 'from-[#7bbf8e]');

      // ── TEXT COLORS ───────────────────────────────────────────
      // white text → dark forest green (for light bg)
      content = content.replace(/\btext-white\b/g, 'text-[#1b5e20]');
      content = content.replace(/\btext-gray-100\b/g, 'text-[#2e7d32]');
      content = content.replace(/\btext-gray-200\b/g, 'text-[#2e7d32]');
      content = content.replace(/\btext-gray-300\b/g, 'text-[#4a7c59]');
      content = content.replace(/\btext-gray-400\b/g, 'text-[#6a9878]');
      content = content.replace(/\btext-gray-500\b/g, 'text-[#7aaa88]');
      // sky blue text → sage green
      content = content.replace(/text-\[#0ea5e9\]/g, 'text-[#3d7a54]');
      content = content.replace(/text-\[#38bdf8\]/g, 'text-[#5a9e6f]');
      content = content.replace(/text-\[#0284c7\]/g, 'text-[#2e7d32]');

      // ── BORDERS ──────────────────────────────────────────────
      content = content.replace(/border-\[#0ea5e9\]/g, 'border-[#5a9e6f]');
      content = content.replace(/border-\[#38bdf8\]/g, 'border-[#7bbf8e]');
      content = content.replace(/border-\[#0284c7\]/g, 'border-[#3d7a54]');
      content = content.replace(/border-white\/10/g, 'border-[#5a9e6f]/20');
      content = content.replace(/border-white\/5/g, 'border-[#5a9e6f]/10');

      // ── OPACITY BACKGROUNDS ───────────────────────────────────
      content = content.replace(/bg-white\/5/g, 'bg-[#5a9e6f]/5');
      content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-[#5a9e6f]/5');
      content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-[#5a9e6f]/5');
      content = content.replace(/bg-white\/\[0\.08\]/g, 'bg-[#5a9e6f]/10');

      // ── RGBA COLORS ───────────────────────────────────────────
      // dark shadows → light soft shadows
      content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.[0-9]+\)/g, 'rgba(90, 158, 111, 0.1)');
      content = content.replace(/rgba\(0,\s*229,\s*255,/g, 'rgba(90, 158, 111,');
      content = content.replace(/rgba\(14,\s*165,\s*233,/g, 'rgba(90, 158, 111,');
      content = content.replace(/rgba\(2,\s*132,\s*199,/g, 'rgba(61, 122, 84,');
      content = content.replace(/rgba\(56,\s*189,\s*248,/g, 'rgba(123, 191, 142,');
      content = content.replace(/rgba\(23,\s*23,\s*23,/g, 'rgba(240, 247, 240,');
      content = content.replace(/rgba\(38,\s*38,\s*38,/g, 'rgba(255, 255, 255,');

      // ── GLOBALS CSS SPECIFIC ──────────────────────────────────
      if (file.endsWith('globals.css')) {
        content = content.replace(/--main-bg:\s*#[0-9a-fA-F]+;/g, '--main-bg: #f0f7f0;');
        content = content.replace(/--card-bg:\s*[^;]+;/g, '--card-bg: rgba(255, 255, 255, 0.85);');
        content = content.replace(/--card-bg-active:\s*[^;]+;/g, '--card-bg-active: rgba(255, 255, 255, 0.95);');
        content = content.replace(/--pure-white:\s*#[0-9a-fA-F]+;/g, '--pure-white: #1b5e20;');
        content = content.replace(/--primary-orange:\s*#[0-9a-fA-F]+;/g, '--primary-orange: #5a9e6f;');
        content = content.replace(/--primary-blue:\s*#[0-9a-fA-F]+;/g, '--primary-blue: #3d7a54;');
        content = content.replace(/--body-gray-text:\s*#[0-9a-fA-F]+;/g, '--body-gray-text: #4a7c59;');
        content = content.replace(/--medium-gray-title:\s*#[0-9a-fA-F]+;/g, '--medium-gray-title: #2e7d32;');
        content = content.replace(/background:\s*var\(--main-bg\);\s*color:\s*var\(--pure-white\);/g,
          'background: var(--main-bg); color: #1b5e20;');
        // Fix glass-navbar bg
        content = content.replace(/background:\s*rgba\(23,\s*23,\s*23,\s*0\.85\);/g, 'background: rgba(255, 255, 255, 0.92);');
        // Fix glass-card bg
        content = content.replace(/background:\s*rgba\(38,\s*38,\s*38,\s*0\.8\);/g, 'background: rgba(255, 255, 255, 0.75);');
      }

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated to sage green: ${path.relative('./src', file)}`);
      }
    } catch(e) { /* skip */ }
  });
  console.log(`\nDone! Modified ${count} files to Sage Green theme.`);
});
