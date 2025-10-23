# 🚀 Vercel Environment Variables Import Guide

## 📋 **Environment Variables for Vercel**

### **Copy and paste these into Vercel Environment Variables section:**

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://othmane-coding-academy-v2.vercel.app
NODE_ENV=production
```

---

## 🔧 **How to Import in Vercel:**

### **Method 1: Copy from File**
1. **Open:** `frontend/vercel-env-variables.txt`
2. **Copy all content**
3. **Paste into Vercel** → Environment Variables → "or paste the .env contents above"

### **Method 2: Add Manually**
1. **Go to Vercel** → Your Project → Settings → Environment Variables
2. **Add each variable one by one:**

| **Name** | **Value** |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` |
| `NODE_VERSION` | `18` |
| `NEXT_PUBLIC_SITE_URL` | `https://othmane-coding-academy-v2.vercel.app` |
| `NODE_ENV` | `production` |

---

## 📝 **Step-by-Step Instructions:**

### **1. In Vercel Dashboard:**
1. **Go to your project**
2. **Click "Settings"** tab
3. **Click "Environment Variables"**
4. **Click "Add Environment Variable"**

### **2. Add Each Variable:**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `http://localhost:8000/api`
- **Environment:** All (Production, Preview, Development)
- **Click "Save"**

- **Name:** `NODE_VERSION`
- **Value:** `18`
- **Environment:** All
- **Click "Save"**

- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://othmane-coding-academy-v2.vercel.app`
- **Environment:** All
- **Click "Save"**

- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** All
- **Click "Save"**

### **3. Deploy:**
1. **Go back to "Deployments"** tab
2. **Click "Deploy"** or **"Redeploy"**

---

## 🎯 **Expected Results:**

After importing these variables:
- ✅ **Build will succeed**
- ✅ **Deployment will complete**
- ✅ **Site will be live at:** `https://othmane-coding-academy-v2.vercel.app`

---

## 🔧 **Files Created:**

- **`vercel-env-variables.txt`** - Text file with variables
- **`vercel-env-variables.env`** - .env file with variables
- **`VERCEL_IMPORT_GUIDE.md`** - This guide

---

## 🚀 **Quick Import:**

**Copy this and paste into Vercel:**

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://othmane-coding-academy-v2.vercel.app
NODE_ENV=production
```

**Your Next.js frontend will deploy successfully!** 🎉
