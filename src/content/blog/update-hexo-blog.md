---
title: Update Hexo Blog
date: 2025-11-27 14:13:12
tags:
  - skill
---

This is a cheat sheet for updating your hexo blogs, which assumes you have already set up the theme.

## Add a blog

```bash
$ hexo new [layout] <title>
```

In my case I generally use `post` for layout, also since I'm using local environment I run commands with `npx`.

## Build & Deploy

```bash
$ hexo clean && hexo g
```
This will clean the old generated files and regenerate the static files.
```bash
$ hexo s
```
This allows you to preview locally.

```bash
$ hexo d # or directly hexo clean && hexo g && hexo d
```
This will deploy the static files to the platform (should be configured in the _config.yml).

---
For more detail check [official docs](https://hexo.io/docs/)