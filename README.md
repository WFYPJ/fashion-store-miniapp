## 👗 WeChat Mini Program: Online Fashion Store

A cloud-powered fashion store Mini Program built on Tencent Cloud. It enables users to browse categorized clothing items, view product details, and provides an admin portal for uploading, editing, and deleting products.

![License](https://img.shields.io/github/license/WFYPJ/fashion-store-miniapp)
![Last Commit](https://img.shields.io/github/last-commit/WFYPJ/fashion-store-miniapp)
![Stars](https://img.shields.io/github/stars/WFYPJ/fashion-store-miniapp?style=social)

---

## 🧾 Overview


This Mini Program supports the following:

- Categorized product display (main + subcategories)  
- Image upload to Tencent Cloud COS using temporary credentials  
- Admin backend for full product management  
- Separation of admin and regular user views  
- Simple UI with modern layout and mobile responsiveness  

---

## 🎯 Features

- 🛍 **Product Catalog**  
  Browse products by main and sub categories

- 🖼 **Image Upload via COS**  
  Upload primary, carousel, and detail images directly to Tencent Cloud COS

- 👨‍💼 **Admin Portal** (under Store tab)  
  Add/edit/delete products  
  View both listed and unlisted items  
  Trigger frontend refresh after edits

- 📰 **Homepage Sections**  
  - New Arrivals (latest products by date)  
  - Recommended Products (random selection)

- 🧭 **Category Navigation**  
  Intuitive tag-based filters for category and subcategory

---

## 🛠 Tech Stack

- **Frontend**: WeChat Mini Program (WXML / WXSS / JavaScript)  
- **Backend**: Tencent Cloud Functions (Node.js)  
- **Storage**: Tencent Cloud COS (Object Storage)  

---

## 📁 Project Structure
<pre lang="md">

```
cloudfunctions/
├── getopenid/              Retrieve openid for user identity
└── getCosTempCredentials/  Generate temporary credentials for COS upload

miniprogram/
├── pages/
│   ├── home/               Homepage with banners and product highlights
│   ├── category/list/      Product filtering by category/subcategory
│   ├── goods/details/      Product detail page
│   ├── store/              Store info page + admin access
│   └── admin/
│       ├── add/            Add new product
│       ├── edit/           Edit product details
│       └── good-list/      Manage all products (edit/delete)
├── services/good/          Product fetch functions
├── utils/
│   ├── config.sample.js    Sample COS config (safe for public use)
│   └── constants.js        Category names and size options
└── icons/, images/         Icons and static image assets
```
</pre>


---

## 🚀 Setup & Deployment

1. Clone this repo and open it in **WeChat Developer Tools**  
2. Deploy cloud functions:  
   - `getopenid` – retrieves user identity  
   - `getCosTempCredentials` – generates temporary upload credentials  
     > Set `TENCENT_SECRET_ID` and `TENCENT_SECRET_KEY` in environment variables  
3. Configure COS credentials:  
   - Copy `utils/config.sample.js` to `config.js` (**Do NOT commit `config.js`**)  
   - Fill in your COS Bucket, Region, and URL prefix  
4. Add your COS domain to the **request domain whitelist** in the WeChat console  
5. Test the Mini Program on a real device

---

## 💡 Future Improvements

- Image CDN optimization and signed URL support  
- Shopping cart and checkout system  
- Admin role-based access control  
- Product search and pagination  
- i18n (internationalization)

---

👤 Author

Fei Wang

---

📄 License

MIT License

---

📸 Screenshots

Below are screenshots demonstrating the UI and core features of the Mini Program:

#### Homepage

<p align="center">
  <img src="screenshots/home.PNG" alt="Homepage" width="45%" />
</p>

#### Category Page
<p align="center">
  <img src="screenshots/category1.PNG" alt="Category 1" width="45%" />
  <img src="screenshots/category2.PNG" alt="Category 2" width="45%" />
</p>

#### Product List
<p align="center">
  <img src="screenshots/product-list.PNG" alt="Product List" width="45%" />
</p>

#### Product Details
<p align="center">
  <img src="screenshots/details1.PNG" alt="Details 1" width="45%" />
  <img src="screenshots/details2.PNG" alt="Details 2" width="45%" />
</p>

#### Store Information Page
<p align="center">
<img src="screenshots/store.PNG" alt="Store Information" width="45%" />
</p>

#### Admin Panel
<p align="center">
<img src="screenshots/admin.PNG" alt="Admin Panel" width="60%" />
</p>

#### Add New Product
<p align="center">
  <img src="screenshots/add1.PNG" alt="Add Product 1" width="45%" />
  <img src="screenshots/add2.PNG" alt="Add Product 2" width="45%" />
</p>

#### Edit Product
<p align="center">
  <img src="screenshots/edit-list.PNG" alt="Edit List" width="45%" />
  <img src="screenshots/edit1.PNG" alt="Edit 1" width="45%" />
</p>
<p align="center">
  <img src="screenshots/edit2.PNG" alt="Edit 2" width="30%" />
  <img src="screenshots/edit3.PNG" alt="Edit 3" width="30%" />
  <img src="screenshots/edit4.PNG" alt="Edit 4" width="30%" />
</p>

