# 每天一个小好奇

每天一个小好奇，趣味知识分享平台。

## 内容结构

```
content/
  YYYY-MM/
    YYYY-MM-DD.md    # 每日一篇好奇文章
images/
  YYYY-MM/
    YYYY-MM-DD.jpg   # 每日配图
```

### frontmatter 格式

```yaml
---
date: 2026-01-01
title: 文章标题
subtitle: 副标题
image: ../images/2026-01/2026-01-01.jpg
---

正文内容（支持 **粗体**）
```

## 添加新内容

1. 在 `content/YYYY-MM/` 下创建 `YYYY-MM-DD.md` 文件
2. 在 `images/YYYY-MM/` 下放入对应配图
3. 提交到 GitHub，页面会自动更新

## 本地开发

页面直接打开 `index.html` 即可运行（需联网以加载 GitHub 内容）。

## GitHub Pages

页面地址：https://pythias.github.io/ai-daily-curiosity
