# 🧠 ACCN 專案同步懶人流程表（公司 / 家用機共用）

## ✅ 第一次在另一台電腦使用：
```bash
git clone https://github.com/LinLeeLung/accn.git
cd accn
npm install
```

## ✅ 第二次以後再使用：
```bash
git pull
npm install
npm run dev
```

## ✅ 更新 gh-pages (GitHub Pages 部署用)
```bash
git switch main
git merge testbranch
npm run build
git add .
git commit -m "build for gh-pages"
git push

# 部署至 gh-pages branch
npm run deploy
```

## ✅ GitHub Actions 自動部署
1. 在專案根目錄建立 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
2. 確保 `vite.config.js` 中的 `base` 正確設為 `/accn/`
3. 推送 main 分支後會自動部署

---

## 💡 Codespaces 啟動常見問題與修復
如在 GitHub Codespaces 環境中執行 `npm run dev` 出現 Tailwind 模組缺失或其他錯誤，請嘗試以下修復：

```bash
npm run fix-dev
```

或手動執行以下命令：
```bash
rm -rf node_modules
rm package-lock.json
npm install --force
npm run dev
```

### ✅ 自動修復腳本
在 `package.json` 中加入：
```json
"scripts": {
  "fix-dev": "rm -rf node_modules && rm package-lock.json && npm install --force && npm run dev"
}
```

如遇錯誤訊息：
```
Cannot find module 'tailwindcss/dist/chunk-xxxxxx.mjs'
```
這是 Tailwind 模組在 Codespace 安裝過程中未完全解析造成，`npm run fix-dev` 指令能強制重建依賴。

---

> 如需每次都重新自動部署至 GitHub Pages，可您進一步啟用 GitHub Action 自動把 dist/ 換成 gh-pages branch 更新哦！

