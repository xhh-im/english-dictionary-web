# 部署指南

本指南将帮助你将英汉词典网站部署到 GitHub Pages，并配置 Supabase 实现跨端数据同步。

## 📋 前置要求

- GitHub 账号
- Supabase 账号（免费）
- 基本的 Git 操作知识

## 🚀 部署步骤

### 第一步：Fork 仓库

1. 访问本项目的 GitHub 仓库
2. 点击右上角的 **Fork** 按钮
3. 等待 Fork 完成

### 第二步：准备词典数据

1. 下载 [Open English Dictionary](https://github.com/ahpxex/open-english-dictionary) 的词典数据
2. 将所有 JSON 文件放入你 Fork 的仓库的 `public/dictionary/` 目录
3. 在本地运行索引构建脚本：

```bash
npm install
npm run build-index
```

4. 提交词典文件和生成的索引：

```bash
git add public/dictionary/
git commit -m "Add dictionary data and index"
git push
```

> **注意**: 现在使用按需加载，保持原始文件结构，只生成一个轻量级索引文件。

### 第三步：创建 Supabase 项目

#### 3.1 并创建项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 **Start your project**
3. 使用 GitHub 账号登录
4. 点击 **New Project**
5. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: 例如 `english-dictionary-web`
   - **Database Password**: 设置一个强密码（请保存好）
   - **Region**: 选择离你最近的区域
   - **Pricing Plan**: 选择 **Free**
6. 点击 **Create new project**，等待项目初始化（约 2 分钟）

#### 3.2 创建数据库表

1. 在 Supabase 项目中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 复制本仓库中的 `supabase-schema.sql` 文件内容
4. 粘贴到 SQL 编辑器中
5. 点击 **Run** 执行脚本
6. 验证表已创建：在左侧菜单点击 **Table Editor**，应该看到：
   - `user_collections`
   - `user_progress`

#### 3.3 配置认证提供商（可选）

**启用 Google OAuth（推荐）：**

1. 在 Supabase 项目中，点击左侧菜单的 **Authentication** > **Sign In / Providers**
2. 找到 **Google**，点击右侧的编辑图标
3. 将 **Enable Sign in with Google** 开关打开
4. 按照页面提示完成 Google OAuth 配置：
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建 OAuth 2.0 客户端 ID
   - 将 Supabase 提供的回调 URL 添加到授权重定向 URI
   - 复制 Client ID 和 Client Secret 到 Supabase
5. 点击 **Save**
6. 点击左侧菜单的 **Authentication** > **URL Configuration**
7. 将**Site URL**设置成你的Github部署后的域名，使用自定义域名则设置为自定义域名
#### 3.4 获取项目凭证

1. 点击左侧菜单的 **Settings** > **API Settings**
2. 复制以下信息：
   - **API Settings / Project URL** (例如: `https://xxxxx.supabase.co`)
   - **API Keys / Legacy API Keys / anon public key** (以 `eyJ` 开头的长字符串)

### 第四步：配置 GitHub Secrets

1. 进入你 Fork 的仓库
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 添加以下两个 Secret：

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: 你的 Supabase Project URL

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: 你的 Supabase anon public key

5. 点击 **Add secret** 保存

### 第五步：启用 GitHub Pages

1. 在仓库设置中，点击 **Pages**
2. 在 **Source** 下：
   - 选择 **GitHub Actions** （如果没有此选项，请确保已推送 `.github/workflows/deploy.yml` 文件）
3. 点击 **Save**

### 第六步：触发部署

有两种方式触发部署：

**方式 1: 推送代码**
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

**方式 2: 手动触发**
1. 在仓库中，点击 **Actions** 标签
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow**
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow**

### 第七步：访问你的网站

1. 等待 GitHub Actions 完成部署（约 2-5 分钟）
2. 访问：`https://your-username.github.io/english-dictionary-web/`

> 如果仓库名不是 `english-dictionary-web`，需要修改 `vite.config.js` 中的 `base` 路径：
> ```js
> base: '/your-repo-name/'
> ```

## 🔧 自定义配置

### 修改仓库名称后更新 base 路径

如果你重命名了仓库，需要更新 `vite.config.js`：

```js
export default defineConfig({
  // ...
  base: process.env.NODE_ENV === 'production' ? '/your-new-repo-name/' : '/',
})
```

### 使用自定义域名

1. 在仓库根目录创建 `public/CNAME` 文件
2. 文件内容为你的域名，例如：
   ```
   dictionary.yourdomain.com
   ```
3. 在你的域名 DNS 设置中添加 CNAME 记录：
   - Name: `dictionary` (或你的子域名)
   - Value: `your-username.github.io`
4. 推送更改并等待部署完成
5. 在 GitHub Pages 设置中验证自定义域名

### 更新环境变量

如果需要更新 Supabase 配置：

1. 进入仓库的 **Settings** > **Secrets and variables** > **Actions**
2. 找到对应的 Secret
3. 点击 **Update** 修改值
4. 重新触发部署

## 🐛 故障排除

### 部署失败

**检查 Actions 日志：**
1. 点击 **Actions** 标签
2. 点击失败的工作流运行
3. 查看错误信息

**常见问题：**

- **错误**: `Module not found` 或 `Cannot find module`
  - **解决**: 确保所有依赖都在 `package.json` 中，运行 `npm install` 后提交 `package-lock.json`

- **错误**: `Failed to load config`
  - **解决**: 检查 `vite.config.js` 语法是否正确

- **错误**: `Permission denied`
  - **解决**: 检查 GitHub Pages 设置，确保启用了 GitHub Actions

### Supabase 连接失败

**检查 Secrets 配置：**
1. 确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 正确设置
2. 确保没有多余的空格或引号

**检查 RLS 策略：**
1. 在 Supabase 的 **Table Editor** 中确认 RLS 已启用
2. 在 **Authentication** > **Policies** 中检查策略是否正确

**检查网络请求：**
1. 打开浏览器开发者工具（F12）
2. 查看 **Network** 标签
3. 检查 Supabase API 请求的响应

### 页面空白或 404

**检查 base 路径：**
- 确保 `vite.config.js` 中的 `base` 与你的仓库名称一致

**检查 GitHub Pages 设置：**
- 确保 Source 设置为 **GitHub Actions**

**清除缓存：**
- 按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新

### 数据不同步

**检查登录状态：**
- 确保用户已成功登录
- 查看浏览器控制台是否有错误

**检查 Supabase 配置：**
- 在 Supabase 的 **API Settings** 中确认 URL 和 Key 正确
- 检查 RLS 策略是否允许用户访问自己的数据

## 📊 免费额度说明

### Supabase 免费版限制

- **数据库空间**: 500 MB
- **带宽**: 5 GB/月
- **API 请求**: 50,000/月
- **用户认证**: 50,000 活跃用户/月

> 对于个人使用或小型项目，免费版完全够用！

### GitHub Pages 限制

- **存储空间**: 1 GB
- **带宽**: 100 GB/月
- **构建时间**: 10 分钟/次

## 🔐 安全建议

1. **不要泄露 Supabase 密钥**
   - 永远不要将 `.env` 文件提交到 Git
   - 使用 GitHub Secrets 管理敏感信息

2. **定期更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

3. **启用 GitHub 两步验证**
   - 保护你的代码和配置

4. **定期备份 Supabase 数据**
   - 在 Supabase Dashboard 中下载数据库备份

## 💡 优化建议

### 性能优化

1. **启用 CDN**：GitHub Pages 已自动启用 CDN
2. **压缩图片**：使用 WebP 格式优化图片
3. **代码分割**：Vite 已自动配置，无需额外设置

### SEO 优化

1. 修改 `index.html` 中的 meta 标签
2. 添加 `robots.txt` 和 `sitemap.xml`
3. 使用语义化 HTML 标签

## 📞 获取帮助

如果遇到问题：

1. 查看本文档的故障排除部分
2. 搜索 [GitHub Issues](https://github.com/TICKurt/english-dictionary-web/issues)
3. 提交新的 Issue 并详细描述问题

---

🎉 恭喜！你已成功部署自己的英汉词典网站！

