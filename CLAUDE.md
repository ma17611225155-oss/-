# CLAUDE.md

## 项目定位

纯前端单机卡牌游戏（类 Balatro），单文件实现，无构建工具、无框架、无依赖。

## 技术栈

- 语言：HTML5 / CSS3 / Vanilla JavaScript（ES6+）
- 字体：Google Fonts（Noto Sans SC、JetBrains Mono）
- 入口：`index.html`（样式与逻辑均内联，不拆分文件）

## 目录约定

| 路径 | 说明 |
|------|------|
| `index.html` | 游戏主体，所有 CSS/JS 内联于此 |
| `PRD.html` | 产品需求文档，供参考，不参与游戏运行 |
| `DESIGN.html` | 视觉设计规范，供参考，不参与游戏运行 |
| `agents/` | Claude Code Agent 定义文件 |
| `slash/` | Claude Code 斜杠命令定义文件 |

## 核心游戏逻辑（index.html 内 `<script>`）

- `buildDeck()` / `shuffle()` / `deal()` — 牌组构建与发牌
- `detectHand(cards)` — 识别牌型（高牌→皇家同花顺）
- `calcScore(cards)` — 计算得分：`(base + 牌点之和) × mult`
- `playHand()` / `discardHand()` — 出牌与弃牌主流程
- `render()` — 全量渲染（HUD、手牌区、出牌区、按钮状态）

## 常用操作

```bash
# 本地运行（无需服务器）
open index.html

# 查看游戏逻辑
grep -n "function " index.html
```

## 修改注意

- `HAND_TYPES` 常量定义了所有牌型名称、基础分和倍率，调整难度改这里
- `TARGET / MAX_PLAYS / MAX_DISCARDS / MAX_HAND` 控制局面参数
- CSS 变量定义在 `:root` 块，改颜色主题只需修改变量值
