# 我的健康 · Web 版

## 功能

- **首页登录**：姓名 + 手机号，信息保存在浏览器 `localStorage`
- **自动登录**：刷新页面后若已登录，直接进入主页
- **体检 / 复查提醒**：按 DDL 排序，显示 60 天内到期项
- **家庭成员**：每人一个独立板块，展示下次常规体检与复查截止时间
- **体检档案**：点进成员可上传 PDF / 拍照，按日期归档，时间轴查看

## 启动

```bash
cd health-app
npm install
npm run dev
```

打开终端显示的地址（一般为 http://localhost:3000）。

## 主要文件

| 文件 | 说明 |
|------|------|
| `src/app/page.tsx` | 登录 / 主页切换 |
| `src/components/LoginForm.tsx` | 登录表单 |
| `src/components/HomeDashboard.tsx` | 登录后主界面 |
| `src/components/MemberBlock.tsx` | 家庭成员板块 |
| `src/components/ReminderList.tsx` | 提醒列表 |
| `src/lib/storage.ts` | 本地存储 |
| `src/lib/mock-data.ts` | 默认家庭成员与日期 |
| `src/app/member/[id]/page.tsx` | 成员档案页（上传 + 时间轴） |
| `src/lib/document-store.ts` | 体检单本地 IndexedDB 存储 |
