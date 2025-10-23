# 🔧 Vercel Manual Environment Variables Fix

## 🚨 **The Problem:**
Vercel is trying to reference a secret called `api_url` that doesn't exist.

## 🔧 **The Solution:**
Add each environment variable manually, one by one.

---

## 📋 **Step-by-Step Manual Fix:**

### **1. Go to Vercel Dashboard:**
1. **Go to your project**
2. **Click "Settings"** tab
3. **Click "Environment Variables"**

### **2. Delete ALL Existing Variables:**
1. **Find any existing variables**
2. **Delete them ALL** (especially any that reference secrets)
3. **Make sure the list is empty**

### **3. Add Variables ONE BY ONE:**

#### **Variable 1:**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://jsonplaceholder.typicode.com`
- **Environment:** All (Production, Preview, Development)
- **Click "Save"**

#### **Variable 2:**
- **Name:** `NODE_VERSION`
- **Value:** `18`
- **Environment:** All
- **Click "Save"**

#### **Variable 3:**
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://othmane-coding-academy-v2.vercel.app`
- **Environment:** All
- **Click "Save"**

#### **Variable 4:**
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** All
- **Click "Save"**

---

## ✅ **Final Environment Variables List:**

| **Name** | **Value** |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://jsonplaceholder.typicode.com` |
| `NODE_VERSION` | `18` |
| `NEXT_PUBLIC_SITE_URL` | `https://othmane-coding-academy-v2.vercel.app` |
| `NODE_ENV` | `production` |

---

## 🚀 **After Adding All Variables:**

### **1. Verify the List:**
- Make sure you have exactly 4 variables
- Make sure none reference secrets
- Make sure all have "All" environments selected

### **2. Deploy:**
1. **Go to "Deployments"** tab
2. **Click "Deploy"** or **"Redeploy"**
3. **Wait for build to complete**

---

## 🎯 **Expected Results:**

After manual setup:
- ✅ **No secret references**
- ✅ **Build will succeed**
- ✅ **Deployment will complete**
- ✅ **Site will be live at:** `https://othmane-coding-academy-v2.vercel.app`

---

## 🔧 **Important Notes:**

### **DO NOT:**
- ❌ Use "or paste the .env contents above" (this might cause secret references)
- ❌ Reference any secrets
- ❌ Use variables that reference other variables

### **DO:**
- ✅ Add each variable manually
- ✅ Use direct values only
- ✅ Set environment to "All" for each variable

---

## 🚀 **Quick Checklist:**

- [ ] ✅ **Deleted all existing variables**
- [ ] ✅ **Added NEXT_PUBLIC_API_URL manually**
- [ ] ✅ **Added NODE_VERSION manually**
- [ ] ✅ **Added NEXT_PUBLIC_SITE_URL manually**
- [ ] ✅ **Added NODE_ENV manually**
- [ ] ✅ **All variables set to "All" environments**
- [ ] ✅ **No secret references**

**Your deployment will succeed!** 🎉
