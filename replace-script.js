const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/GrapTask LMS/nextgen-lms/frontend/src/app/trainer');
let replacedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('DashboardShell')) {
    content = content.replace(/import \{ DashboardShell \} from '@\/components\/layout\/DashboardShell';/g, "import { TrainerLayout } from '@/features/trainer/TrainerLayout';");
    content = content.replace(/<DashboardShell area="Trainer">/g, '<TrainerLayout>');
    content = content.replace(/<\/DashboardShell>/g, '</TrainerLayout>');
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log('Replaced in', file);
  }
});
console.log('Total files replaced:', replacedCount);
