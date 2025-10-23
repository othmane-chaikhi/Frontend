# 🚀 Vercel Deployment with Temporary API

## 📋 **Temporary API Options for Deployment**

### **Option 1: JSONPlaceholder (Recommended)**
```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

### **Option 2: Mock API**
```
NEXT_PUBLIC_API_URL=https://mockapi.io/api/v1
```

### **Option 3: ReqRes API**
```
NEXT_PUBLIC_API_URL=https://reqres.in/api
```

### **Option 4: HTTPBin**
```
NEXT_PUBLIC_API_URL=https://httpbin.org
```

---

## 🔧 **Recommended: JSONPlaceholder**

**Use this for your deployment:**

```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://othmane-coding-academy-v2.vercel.app
NODE_ENV=production
```

**Why JSONPlaceholder?**
- ✅ **Free and reliable**
- ✅ **Always available**
- ✅ **Returns JSON data**
- ✅ **No authentication required**
- ✅ **Perfect for testing**

---

## 📝 **Step-by-Step Deployment:**

### **1. Copy Temporary Variables:**
```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://othmane-coding-academy-v2.vercel.app
NODE_ENV=production
```

### **2. In Vercel Dashboard:**
1. **Go to Environment Variables**
2. **Delete any existing variables**
3. **Paste the temporary variables above**
4. **Click "Save"**

### **3. Deploy:**
1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your site will be live!**

---

## 🎯 **After Deployment:**

### **Your Frontend Will:**
- ✅ **Deploy successfully**
- ✅ **Be accessible at:** `https://othmane-coding-academy-v2.vercel.app`
- ✅ **Load all pages correctly**
- ✅ **Show SEO optimization**
- ✅ **Work on mobile**

### **API Calls Will:**
- ✅ **Not fail** (JSONPlaceholder returns data)
- ✅ **Show loading states**
- ✅ **Display placeholder content**

---

## 🔧 **Later - Update to Real Backend:**

### **After You Deploy Your Backend to Render:**

1. **Get your Render backend URL** (e.g., `https://my-backend.onrender.com`)
2. **Update Vercel environment variable:**
   ```
   NEXT_PUBLIC_API_URL=https://my-backend.onrender.com/api
   ```
3. **Redeploy your frontend**

---

## 🚀 **Quick Deploy Now:**

**Copy and paste this into Vercel:**

```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://othmane-coding-academy-v2.vercel.app
NODE_ENV=production
```

**Your frontend will deploy successfully with a temporary API!** 🎉

---

## 📊 **What JSONPlaceholder Provides:**

- **Posts:** `/posts` - Blog posts data
- **Users:** `/users` - User profiles
- **Comments:** `/comments` - Comments data
- **Albums:** `/albums` - Photo albums
- **Photos:** `/photos` - Images

**Perfect for testing your frontend without a real backend!** 🚀
