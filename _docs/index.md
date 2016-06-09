---
layout: doc
title: Installation
navigation_weight: 1
---

# Installation

Installing {{ site.project_name }} is easy and straight-forward, but there are a few requirements you’ll need
to make sure your system has before you start.

## Requirements

You will need to install some stuff, if they are not yet installed in your machine:

* [Node.js (v4.3.2 or higher; LTS)](http://nodejs.org)
* [NPM (v3.5+; bundled with node.js installation package)](https://docs.npmjs.com/getting-started/installing-node#updating-npm)

If you've already installed the above you may need to only update **npm** to the latest version:

```bash
$ sudo npm update -g npm
```

---

## Install with Github

Best way to install {{ site.project_name }} is to clone {{ site.project_name }} from Github

**To clone/download the boilerplate**

```bash
$ git clone {{ site.project_url }}
```

**After cloning, get into your cloned {{ site.project_name }}'s directory/folder**

```bash
$ cd project-mulla
```

**Install all of the projects dependencies with:**

```bash
$ npm install
```
