import fs from 'fs';
import path from 'path';

const dirs = ['dist', 'dist-electron'];

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  }
});
