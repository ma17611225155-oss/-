# CLAUDE.md

## 项目定位

前端单机卡牌游戏（类 Balatro），基于 Vue 3 + Vite 构建，计划用 Tauri 打包为跨端桌面 App。

## 技术栈

- 框架：Vue 3（Composition API）
- 构建：Vite 6
- 跨端：Tauri 2（待接入，需安装 Rust）
- 字体：Google Fonts（Noto Sans SC、JetBrains Mono）
- 入口：`index.html` → `src/main.js` → `src/App.vue`

## 目录约定

| 路径 | 说明 |
|------|------|
| `index.html` | Vite HTML 入口 |
| `src/App.vue` | 根组件，组合所有子组件 |
| `src/composables/useGame.js` | 游戏全部状态与逻辑 |
| `src/components/` | UI 组件（HUD、PlayZone、HandZone 等） |
| `src/style.css` | 全局样式（vw/vh 自适应单位） |
| `docs/PRD.html` | 产品需求文档 |
| `docs/DESIGN.html` | 视觉设计规范 |
| `archive/index_v1.html` | V1.0 原始单文件版本备份 |
| `tools/agents/` | Claude Code Agent 定义文件 |
| `tools/slash/` | Claude Code 斜杠命令定义文件 |

## 核心游戏逻辑（src/composables/useGame.js）

- `buildDeck()` / `shuffle()` / `deal()` — 牌组构建与发牌
- `detectHand(cards)` — 识别牌型（高牌 → 皇家同花顺）
- `calcScore(cards)` — 计算得分：`(base + 牌点之和) × mult`
- `playHand()` / `discardHand()` — 出牌与弃牌主流程
- `selectedHandInfo` — computed，实时返回当前选牌的牌型与分数

## 常用操作

```bash
# 本地开发
npm run dev        # 启动 Vite 开发服务器（http://localhost:1420）

# 构建
npm run build      # 输出到 dist/

# 接入 Tauri（需先安装 Rust）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
npx tauri init
npm run tauri dev
```

## 修改注意

- `HAND_TYPES` 常量定义牌型名称、基础分和倍率，调整难度改这里
- `TARGET / MAX_PLAYS / MAX_DISCARDS / MAX_HAND` 控制局面参数
- CSS 自适应单位：`--hpx = 100vw/1080`，`--vpx = 100vh/640`，所有尺寸用这两个变量换算
- 颜色主题：修改 `src/style.css` 顶部 `:root` 块内的 CSS 变量即可
