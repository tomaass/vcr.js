import * as fs from 'fs';
import * as path from 'path';

export interface FixturesMap {[key: string]: string; };

const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file: string) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const isFixture = (absolutePath: string): boolean => {
  const extensionSupported = /\.(js|json)$/.test(absolutePath);

  const fixtureMethod = path.basename(absolutePath).split('.')[0].toUpperCase();
  const methodSupported = SUPPORTED_METHODS.indexOf(fixtureMethod) > -1;

  return extensionSupported && methodSupported;
};

export const listDirectoryFixtures = (basePath: string): FixturesMap =>
 walkSync(basePath)
  .filter(isFixture)
  .reduce((acc, absolute) => ({...acc, [path.relative(basePath, absolute)]: absolute}), {});

const listAllFixtures = (dirs: string | string[]): FixturesMap =>
  ([] as string[]).concat(dirs)
    .reduce((acc, dir) => ({...acc, ...listDirectoryFixtures(dir)}), {});

export default listAllFixtures;
