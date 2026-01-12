/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 自动化部署脚本 - 实现打包、整合及压缩备份 (ES Module版本)。
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname 的 ESM 等价实现
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置信息 - 注意：__dirname 现在在 scripts 目录下，需要取父目录作为项目根目录
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const versionDir = path.join(rootDir, 'version');
const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const zipName = `release_${timestamp}.zip`;

async function run() {
    try {
        console.log('🚀 开始自动化打包流程...');

        // 1. 清理旧文件
        console.log('🧹 正在清理旧的编译产物...');
        const pathsToClean = [
            path.join(rootDir, 'dist'),
            path.join(serverDir, 'dist'),
            path.join(serverDir, 'public')
        ];
        pathsToClean.forEach(p => {
            if (fs.existsSync(p)) {
                fs.rmSync(p, { recursive: true, force: true });
                console.log(`   已删除: ${path.relative(rootDir, p)}`);
            }
        });

        // 2. 构建前端
        console.log('🏗️  正在构建前端 (Vite)...');
        execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

        // 3. 搬运前端产物到后端 public
        console.log('🚚 正在构建整合：将 dist 移至 server/public...');
        fs.renameSync(path.join(rootDir, 'dist'), path.join(serverDir, 'public'));

        // 4. 构建后端
        console.log('🏗️  正在构建后端 (TypeScript)...');
        execSync('npm run build', { cwd: serverDir, stdio: 'inherit' });

        // 5. 创建 version 目录
        if (!fs.existsSync(versionDir)) {
            fs.mkdirSync(versionDir);
        }

        // 6. 打包压缩 (使用 PowerShell)
        console.log(`📦 正在生成压缩包: ${zipName}...`);

        const includeItems = ['dist', 'public', 'package.json', '.env'];
        const validItems = includeItems
            .filter(item => fs.existsSync(path.join(serverDir, item)))
            .map(item => `./server/${item}`)
            .join(',');

        // 调用 Windows PowerShell 的压缩命令
        // 注意：PowerShell 路径需要处理逗号和引号
        const psCommand = `powershell -Command "Compress-Archive -Path ${validItems} -DestinationPath './version/${zipName}' -Force"`;

        execSync(psCommand, { stdio: 'inherit', cwd: rootDir });

        console.log('\n=========================================');
        console.log(`✅ 打包成功！`);
        console.log(`📂 压缩包位置: ${path.join(versionDir, zipName)}`);
        console.log('=========================================');

    } catch (error) {
        console.error('\n❌ 打包流程出错:');
        console.error(error.message);
        process.exit(1);
    }
}

run();
