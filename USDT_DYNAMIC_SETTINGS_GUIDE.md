# 🎯 **USDT Dynamic Settings - Complete Guide**

## ✅ **Kya Implement Kiya Gaya Hai:**

### 🔧 **1. Admin Settings Page**
- ✅ **New Settings Tab** admin panel mein add kiya gaya
- ✅ **USDT Address Control** - admin panel se change kar sakte hain
- ✅ **QR Code Upload** - naya QR code upload kar sakte hain
- ✅ **Game Price Control** - price dynamically set kar sakte hain
- ✅ **USDT Rate Control** - conversion rate set kar sakte hain

### 🔧 **2. Database Integration**
- ✅ **website_settings table** use kiya gaya
- ✅ **File Upload System** QR code ke liye
- ✅ **Dynamic Data Fetching** order page mein

### 🔧 **3. Order Page Updates**
- ✅ **Dynamic USDT Address** - database se fetch hota hai
- ✅ **Dynamic QR Code** - admin panel se upload kiya gaya image show hota hai
- ✅ **Dynamic Pricing** - game price aur USDT rate database se aata hai
- ✅ **Real-time Updates** - admin panel mein change karne par order page update ho jata hai

## 🚀 **Kaise Use Kare:**

### **Step 1: Admin Panel Access**
1. `/admin-rs` par jao
2. Login karo: `admin` / `admin123`
3. **Settings** tab click karo

### **Step 2: USDT Settings Update**
```
┌─────────────────────────────────────────┐
│ Payment Settings                        │
├─────────────────────────────────────────┤
│ USDT TRC20 Address:                     │
│ ┌─────────────────────────────────────┐ │
│ │ TYour-New-USDT-Address-Here         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Game Price (INR): [130000]              │
│ USDT Rate (INR):  [89.50]               │
│                                         │
│ Upload New QR Code:                     │
│ [Choose File] usdt_qr.png               │
│                                         │
│ [Save Settings]                         │
└─────────────────────────────────────────┘
```

### **Step 3: QR Code Upload**
- **File Name**: Koi bhi name se upload karo
- **Auto Rename**: System automatically `usdt_qr.png` name kar dega
- **Location**: `client/public/assets/usdt_qr.png` mein save hoga
- **Preview**: Upload karne se pehle preview dikhega

### **Step 4: Order Page Check**
1. Customer login karo
2. `/order` page par jao
3. Last step (Payment) mein dekho:
   - ✅ **New USDT Address** show hoga
   - ✅ **New QR Code** display hoga
   - ✅ **Updated Price** aur **Rate** dikhega

## 🔧 **Technical Details:**

### **Backend APIs:**
```javascript
// Get settings
GET /api/admin/settings
GET /api/admin/public-settings  // For order page

// Update settings
PUT /api/admin/settings (with file upload)
```

### **Database Fields:**
```sql
website_settings table:
- usdt_address: VARCHAR(255)
- usdt_qr_code_path: VARCHAR(255) 
- game_price_inr: VARCHAR(50)
- usdt_rate_inr: VARCHAR(50)
```

### **File Upload:**
```javascript
// QR Code Upload
- Destination: client/public/assets/
- Filename: usdt_qr.png (fixed)
- Size Limit: 5MB
- Types: image/* (PNG, JPG, JPEG)
```

## 🎨 **Features:**

### **Admin Panel:**
- ✅ **Real-time Preview** - QR code upload karne se pehle preview
- ✅ **Current vs New** - purana aur naya QR code side by side
- ✅ **Form Validation** - required fields check
- ✅ **Success Alerts** - save hone par confirmation

### **Order Page:**
- ✅ **Dynamic Loading** - page load par settings fetch
- ✅ **Fallback Values** - agar database mein data nahi hai toh default values
- ✅ **Real-time Calculation** - USDT amount auto calculate
- ✅ **Copy Functionality** - USDT address copy kar sakte hain

## 🔍 **Debug Logs:**

### **Admin Panel Console:**
```
🔧 Submitting settings: {
  usdt_address: "TNew-Address-Here",
  game_price_inr: "130000", 
  usdt_rate_inr: "89.50",
  hasQrFile: true
}
```

### **Order Page Console:**
```
🔧 Fetched USDT settings: {
  usdt_address: "TNew-Address-Here",
  usdt_qr_code_path: "/assets/usdt_qr.png",
  game_price: 130000,
  usdt_rate: 89.50
}
```

### **Backend Terminal:**
```
🔧 Updating settings: { usdt_address: "...", hasQrFile: true }
✅ QR code uploaded and path updated: /assets/usdt_qr.png
✅ Settings updated successfully
```

## 🎯 **Testing Steps:**

### **Test 1: USDT Address Change**
1. Admin panel → Settings → Change USDT address
2. Save settings
3. Order page refresh karo
4. Payment step mein new address dikhna chahiye

### **Test 2: QR Code Upload**
1. Admin panel → Settings → Upload new QR image
2. Save settings  
3. Order page refresh karo
4. Payment step mein new QR code dikhna chahiye

### **Test 3: Price & Rate Update**
1. Admin panel → Settings → Change price/rate
2. Save settings
3. Order page refresh karo
4. Payment step mein updated amount dikhna chahiye

## 🚨 **Important Notes:**

### **QR Code File:**
- **Fixed Name**: Hamesha `usdt_qr.png` name se save hoga
- **Overwrite**: Naya upload karne par purana replace ho jayega
- **Path**: `/assets/usdt_qr.png` - ye path database mein store hota hai

### **Database Dependency:**
- **website_settings table** must exist
- **Default values** agar database empty hai toh fallback values use honge

### **Real-time Updates:**
- Admin panel mein change karne ke baad
- Order page **refresh** karna padega new values ke liye
- Future mein WebSocket add kar sakte hain real-time updates ke liye

## 🎉 **Result:**

**Ab aap admin panel se complete control kar sakte hain:**
- ✅ **USDT Address** - koi bhi TRC20 address set kar sakte hain
- ✅ **QR Code** - apna QR code upload kar sakte hain  
- ✅ **Game Price** - price dynamically change kar sakte hain
- ✅ **USDT Rate** - conversion rate update kar sakte hain

**Customer ko order page par hamesha latest settings dikhenge!** 🚀
