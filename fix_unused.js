import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });
  return files;
}

const files = getFiles('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if(!content.includes('React.') && !content.includes('React ') && !content.includes('React,')) {
    content = content.replace(/import\s+React\s*,\s*\{\s*/g, 'import { ');
    content = content.replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '');
  }

  if(file.includes('src/components/navbar/Sidebar.tsx')) {
    content = content.replace(/ChevronRight,?/g, '');
  }
  if(file.includes('src/app/(admin)/dashboard/categories/page.tsx')) {
    content = content.replace(/GripVertical,?/g, '');
  }
  
  fs.writeFileSync(file, content);
});
console.log('done');
