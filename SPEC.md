# 每天一个小好奇 — 项目规格

## 1. Concept & Vision

一个极简风格的每日好奇心发现平台。每天推送一个引人入胜的小知识，以精美的信息图 + 简洁文字的形式呈现。设计上追求「安静的美感」——像翻开一本精装的百科全书碎片，让人想静静阅读、思考、分享。

整体氛围：安静、好奇、优雅、有深度。

## 2. Design Language

**Aesthetic Direction:** 北欧极简 + 学术气质，灵感来自高品质杂志和博物馆展览视觉

**Color Palette:**
- Background: `#FAFAF8` (暖白)
- Primary Text: `#1A1A1A` (墨黑)
- Secondary Text: `#6B6B6B` (灰)
- Accent: `#E85D4C` (砖红，用于关键词高亮)
- Card Background: `#FFFFFF`
- Subtle Border: `#EEEEEE`

**Typography:**
- 标题: `"Playfair Display"`, serif — 优雅、有书卷气
- 正文: `"Noto Serif SC"`, serif — 适合中文阅读
- 英文辅助: `"Inter"`, sans-serif

**Spatial System:**
- 大量留白，内容区最大宽度 720px
- 内边距: 48px ~ 80px
- 卡片圆角: 12px

**Motion Philosophy:**
- 页面载入时，内容从透明渐入 (opacity 0→1, translateY 20px→0, 600ms ease-out)
- 切换好奇时，柔和淡入淡出
- 信息图悬停有轻微上浮效果

**Visual Assets:**
- 信息图：使用 image_generate 生成的每日定制图片
- 图标：无，纯文字 + 图片
- 装饰：极简分隔线

## 3. Layout & Structure

```
┌─────────────────────────────────────┐
│           [顶部留白区域]              │
│                                     │
│    ╭─────────────────────────╮      │
│    │                         │      │
│    │      [ 信息图区域 ]       │      │
│    │      (16:9 或 1:1)       │      │
│    │                         │      │
│    ╰─────────────────────────╯      │
│                                     │
│         📅 2026年4月2日              │
│                                     │
│    ━━━━ 为何清华叫 Tsinghua ━━━━     │
│                                     │
│    [正文说明段落，若干段]              │
│                                     │
│    ┌─────────────────────────┐      │
│    │  🔄 换一个好奇              │      │
│    └─────────────────────────┘      │
│                                     │
│           [底部留白]                 │
└─────────────────────────────────────┘
```

**Responsive Strategy:**
- Desktop: 内容居中，最大 720px
- Mobile: 全宽，内边距缩小至 24px

## 4. Features & Interactions

**核心功能:**
- 展示当天的好奇心内容（标题 + 信息图 + 说明文字）
- 随机切换另一个好奇（从预设的好奇库中抽取）
- 信息图悬停轻微放大效果

**交互细节:**
- 点击「换一个好奇」→ 当前内容淡出 → 新内容淡入
- 信息图加载时显示占位骨架屏

**数据:**
- 内置 10 个好奇心数据（主题范围：科学、文学、历史、地理、语言）
- 每条数据包含：标题、副标题、信息图Prompt、正文

## 5. Component Inventory

**Header:** 仅 Logo 文字「好奇」二字，小号，灰色

**InfoCard (信息图卡片):**
- 默认：白底卡片，轻微阴影
- 加载中：骨架屏动画（灰色块闪烁）
- 悬停：translateY(-4px)，阴影加深

**CuriosityTitle:**
- 日期标签（小字，灰色）
- 主标题（居中，大字，Playfair Display）
- 装饰性分隔线

**BodyText:**
- 正文段落，Noto Serif SC，18px，行高 1.9
- 关键词高亮（砖红色）

**ShuffleButton:**
- 朴素按钮，hover 时背景变深

## 6. Technical Approach

- 纯前端单 HTML 文件（内联 CSS + JS）
- 无框架依赖
- Google Fonts CDN 引入字体
- 图片使用 image_generate 生成后嵌入
