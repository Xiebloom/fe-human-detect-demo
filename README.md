# MediaPipe Demo

这是一个基于 React、TypeScript、Vite 和 MediaPipe 构建的示例项目，旨在演示 MediaPipe 强大的实时视觉处理能力，例如人脸检测、姿态估计等。

## ✨ 功能特性

- **实时人脸检测**：在视频流或静态图片中检测人脸，并绘制边界框。
- **实时姿态估计**：在视频流或静态图片中识别人体关键点和骨骼连接。
- **多种分析模式**：支持图片上传和实时摄像头视频流分析。
- **可扩展执行器**：模块化的代码结构，方便添加更多 MediaPipe 任务。

## 🛠️ 技术栈

- **前端框架**: [React](https://reactjs.org/)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **视觉处理**: [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision)
- **UI 组件**: 基础 HTML 和 CSS

## 🚀 如何运行

1.  **克隆项目**

    ```bash
    git clone <your-repository-url>
    cd media-pipe-demo
    ```

2.  **安装依赖**

    推荐使用 `npm` 或 `yarn`：

    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  **启动开发服务器**

    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

    应用将在本地启动，通常地址为 `http://localhost:5173`。

4.  **构建项目**

    ```bash
    npm run build
    # 或者
    yarn build
    ```

    构建后的静态文件将输出到 `dist` 目录。

## 📂 项目结构

```
media-pipe-demo/
├── public/               # 静态资源
├── src/
│   ├── assets/           # 图片、字体等资源
│   ├── components/       # React 组件
│   │   └── MediaPipe/    # MediaPipe核心组件和逻辑
│   ├── context/          # React Context
│   ├── executors/        # MediaPipe任务执行器 (如人脸检测、姿态估计)
│   │   ├── face-detection/
│   │   └── pose-landmarker/
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 通用工具函数
│   ├── App.tsx           # 应用主组件
│   └── main.tsx          # 应用入口文件
├── index.html            # HTML 入口文件
├── package.json          # 项目依赖和脚本配置
├── tsconfig.json         # TypeScript 配置文件
├── vite.config.ts        # Vite 配置文件
└── README.md             # 就是你现在看到的这个文件
```
