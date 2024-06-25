import fs from 'node:fs';
import path from 'node:path'; // 确保引入你的日志模块
import { Version } from "./components/index.js";

const readFilesRecursively = (dir) => {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? readFilesRecursively(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
};

const pluginsDir = './plugins/xiaotan-plugin/apps';
const files = readFilesRecursively(pluginsDir).filter(file => /(.js|.ts)$/.test(file));
const arr = [];
files.forEach((file) => {
  arr.push(import(path.resolve(file)));
});

const ret = await Promise.allSettled(arr);
const apps = {};
let successCount = 0;
let failureCount = 0;
const failures = [];
let ver = Version.ver;

logger.info('------------------------^_^------------------------');
logger.info(`小谈插件${ver}加载中……`);
logger.info('██╗  ██╗████████╗██╗   ██╗██╗   ██╗██████╗ ███████╗');
logger.info('╚██╗██╔╝╚══██╔══╝╚██╗ ██╔╝╚██╗ ██╔╝██╔══██╗██╔════╝');
logger.info(' ╚███╔╝    ██║    ╚████╔╝  ╚████╔╝ ██║  ██║███████╗');
logger.info(' ██╔██╗    ██║     ╚██╔╝    ╚██╔╝  ██║  ██║╚════██║');
logger.info('██╔╝ ██╗   ██║      ██║      ██║   ██████╔╝███████║');
logger.info('╚═╝  ╚═╝   ╚═╝      ╚═╝      ╚═╝   ╚═════╝ ╚══════╝');


for (const i in files) {

  const name = path.basename(files[i], path.extname(files[i]));
  if (ret[i].status !== 'fulfilled') {
    failures.push({ name, reason: ret[i].reason });
    logger.error(`载入插件错误：${name}`);
    failureCount++;
  } else {
    const key = Object.keys(ret[i].value)[0];
    apps[name] = ret[i].value[key];
    successCount++;
  }
}

logger.info(`小谈插件${ver}加载完成！成功加载了 ${successCount} 个插件`);
if (failureCount > 0) {
  logger.error(`加载失败的插件有 ${failureCount} 个:`);
  failures.forEach(failure => {
    logger.error(`插件 ${failure.name} 载入失败，原因: ${failure.reason}`);
  });
}

logger.info(`---------------------------------------------------`);
export { apps };
