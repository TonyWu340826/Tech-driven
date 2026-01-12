# TutorConnect (家教连接平台)

一个连接学生与导师的高质量教育平台。支持导师搜索、即时通讯、课程预约和个人信息管理。

## 🌟 核心功能

- **发现导师**：按科目、价格、评分布浏览和搜索导师。
- **即时通讯**：学生与导师之间可以直接在线聊天。
- **课程预约**：便捷的在线/线下课程预约系统及日程管理。
- **个人中心**：完善的个人资料管理，支持头像上传及身份切换。
- **响应式设计**：完美适配移动端和桌面端，支持深色模式。

## 🛠️ 技术栈

### 前端 (Frontend)
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Material Symbols
- **Requests**: Axios

### 后端 (Backend)
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **Auth**: JWT (JSON Web Tokens) + Bcryptjs
- **File Handling**: Multer

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd jiajiao
```

### 2. 环境配置

#### 后端配置
在 `server` 目录下创建 `.env` 文件（或参考 `.env.example`）：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai-teacher
JWT_SECRET=your_jwt_secret
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. 安装依赖

在根目录执行以下命令（会自动安装前端和后端的依赖）：
```bash
npm install
cd server && npm install
```

### 4. 数据库初始化

确保 MySQL 已运行，然后执行：
```bash
cd server
npm run db:init  # 创建表结构
npm run db:seed  # 填充初始测试数据
```

### 5. 运行项目

在根目录运行：
```bash
npm start
```
这将同时启动：
- 前端开发服务器: `http://localhost:5173`
- 后端 API 服务器: `http://localhost:3001`

## 📂 项目结构

```text
├── components/          # 前端通用组件
├── views/               # 各个功能页面的视图
├── server/
│   ├── src/
│   │   ├── config/      # 数据库连接配置
│   │   ├── controllers/ # 业务逻辑
│   │   ├── routes/      # API 路由
│   │   └── scripts/     # 数据库初始化/种子脚本
│   └── schema.sql       # 数据库 SQL 初始脚本
├── App.tsx              # 前端主入口
└── package.json         # 项目依赖与脚本配置
```

## 🌐 部署指南 (宝塔面板)

本项目支持前后端整合部署，即由 Node.js 后端服务统一托管前端静态资源。

### 1. 本地打包与准备
##一键编译  npm run package

1.  **清理旧文件**：删除根目录的 `dist` 以及 `server/public`、`server/dist`。
2.  **前端打包**：在项目根目录运行 `npm run build`。
3.  **整合资源**：将根目录新生成的 `dist` 文件夹，复制到 `server` 文件夹内，并重命名为 `public`。
4.  **后端打包**：进入 `server` 目录，运行 `npm run build`。

### 2. 服务器部署步骤

1.  **环境要求**：在宝塔面板安装 `Nginx`、`MySQL`、`Node.js 版本管理器`。
2.  **上传文件**：将本地 `server` 目录下的所有内容上传到服务器站点目录（不包括 `node_modules`）。
3.  **安装依赖**：在服务器站点目录打开终端，执行 `npm install --production`。
4.  **配置数据库**：
    *   在宝塔创建数据库，导入 `server/schema.sql`。
    *   修改服务器上的 `.env` 文件，更新数据库连接、JWT 等环境变量。
5.  **启动项目**：
    *   进入宝塔 **网站** -> **Node项目** -> **添加Node项目**。
    *   **启动选项**：选择 `./dist/index.js`。
    *   **项目名称**：自定义。
    *   **端口**：填写 `.env` 中定义的端口（默认 3001）。
    *   **绑定域名**：填写你的域名或服务器 IP。

### 3. 如何更新 (二次部署)

当你修改了代码需要更新时，请重复以下步骤：
1.  本地重新执行“打包与准备”。
2.  删除服务器上旧的 `dist` 和 `public` 文件夹。
3.  上传新的 `dist` 和 `public`。
4.  在宝塔 Node 项目列表中点击 **“重启”** 按钮。

## 📄 开源协议

MIT License
