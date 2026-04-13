<div align="center">
    <img src="logo/logo-128.png" width="128" height="128" alt="Baginstrument Logo"/>
    <h1>Baginstrument</h1>
    <p>一个基于 Chrome Extension Manifest V3 的轻量级浏览器扩展</p>
</div>

## 简介

Baginstrument 是一个功能丰富的 Chrome 浏览器扩展，提供了内容采集、自定义页面注入、快捷键操作等功能。本项目基于 Chrome Extension V3 API 构建，可作为学习 Chrome 插件开发的入门模板。

## 主要功能

- **内容采集**：通过右键菜单或快捷键保存网页中选中的文本内容
- **快捷键支持**：使用 `Shift+Alt+S` 快捷键快速保存选中内容
- **Omnibox 搜索**：在地址栏输入 `pick` 关键字进行快速搜索
- **内容脚本注入**：向指定页面注入自定义 CSS 和 JavaScript
- **DevTools 面板**：提供开发者工具扩展面板
- **新标签页覆盖**：自定义浏览器新标签页
- **本地存储**：使用 Chrome Storage API 保存采集的内容
- **通知系统**：保存内容后显示桌面通知

## 项目结构

```
Baginstrument/
├── _locales/           # 国际化语言文件
│   ├── en/            # 英文
│   └── zh_CN/         # 简体中文
├── css/               # 样式文件
├── html/              # HTML 页面
│   ├── popup.html     # 弹出窗口
│   ├── options.html   # 选项页面
│   ├── devtools.html  # 开发者工具页面
│   ├── newtab.html    # 新标签页
│   └── view.html      # 查看页面
├── js/                # JavaScript 文件
│   ├── service-worker.js    # 后台服务脚本
│   ├── content-script.js    # 内容脚本
│   ├── popup.js             # 弹出窗口逻辑
│   ├── devtools.js          # 开发者工具
│   └── view.js              # 查看页面逻辑
├── logo/              # 图标文件
├── manifest.json      # 扩展配置文件
└── README.md          # 项目说明文档
```

## 安装方式

### 方法一：开发者模式安装（推荐）

1. 克隆或下载本项目到本地

2. 打开 Chrome 浏览器，访问扩展管理页面：
   - 地址栏输入 `chrome://extensions/` 并访问
   - 或通过菜单 `更多工具` > `扩展程序` 进入

3. 开启右上角的 **开发者模式** 开关

4. 点击 **加载已解压的扩展程序** 按钮

5. 选择本项目所在的文件夹

6. 安装完成，扩展图标将出现在浏览器工具栏

### 方法二：打包安装

1. 按照方法一的前 4 步操作

2. 点击 **打包扩展程序** 按钮

3. 选择项目根目录，生成 `.crx` 文件

4. 将生成的 `.crx` 文件拖拽到扩展管理页面进行安装

## 使用方法

### 基本使用

1. **保存选中内容**：
   - 在网页中选中任意文本
   - 右键点击，选择 `save to pocket`
   - 或使用快捷键 `Shift+Alt+S`

2. **查看保存的内容**：
   - 点击浏览器工具栏中的扩展图标
   - 点击 `View` 按钮查看已保存的内容列表

### Omnibox 搜索

在地址栏输入 `pick` 后跟搜索关键词，可以快速进行百度搜索或图片搜索：

```
pick 美女      # 搜索图片
pick 关键词     # 百度搜索
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Shift+Alt+S` | 保存当前页面选中的文本 |

### 选项设置

右键点击扩展图标，选择 `选项` 进入设置页面进行配置。

## 权限说明

本扩展需要以下权限：

| 权限 | 用途 |
|------|------|
| `contextMenus` | 创建右键菜单 |
| `tabs` | 管理浏览器标签页 |
| `notifications` | 显示保存通知 |
| `webRequest` | 监听网络请求 |
| `storage` | 本地数据存储 |
| `commands` | 快捷键绑定 |
| `scripting` | 注入脚本 |

## 开发

### 环境要求

- Chrome 浏览器 88 或更高版本
- 文本编辑器（VS Code、Sublime Text 等）

### 调试技巧

1. **查看 Service Worker 日志**：
   - 访问 `chrome://extensions/`
   - 找到本扩展，点击 `service worker` 链接

2. **查看 Content Script 日志**：
   - 打开任意网页的开发者工具（F12）
   - 在 Console 中查看日志

3. **调试 Popup**：
   - 右键点击扩展图标
   - 选择 `检查弹出窗口`

### 实时重载

修改代码后，在扩展管理页面点击刷新按钮即可重新加载扩展。

## 技术栈

- **Manifest Version**: 3
- **后端脚本**: Service Worker
- **内容脚本**: Vanilla JavaScript
- **存储方案**: Chrome Storage Local
- **样式**: CSS3

## 参考资料

- [Chrome Extensions 官方文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/)
- [Chrome Extensions API 参考](https://developer.chrome.com/docs/extensions/reference/)

## License

MIT License
