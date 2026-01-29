# Firebase Sample Data Structure

This document describes the Firestore data structure for the apparel online store.

## Collections

### 1. Products Collection (`products`)

Each product document should have the following structure:

```json
{
  "name": "Classic White T-Shirt",
  "description": "A comfortable and stylish white t-shirt made from 100% cotton.",
  "price": 29.99,
  "originalPrice": 39.99,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "category": "men",
  "subcategory": "shirts",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "colors": ["White", "Black", "Navy"],
  "inStock": true,
  "stockCount": 50,
  "rating": 4.5,
  "reviewCount": 120,
  "featured": true,
  "createdAt": "2026-01-28T00:00:00Z",
  "updatedAt": "2026-01-28T00:00:00Z"
}
```

**Fields:**
- `name` (string, required): Product name
- `description` (string, required): Product description
- `price` (number, required): Current price
- `originalPrice` (number, optional): Original price for sale items
- `images` (array of strings, required): Array of image URLs
- `category` (string, required): Main category (e.g., "men", "women", "kids")
- `subcategory` (string, optional): Subcategory (e.g., "shirts", "pants", "shoes")
- `sizes` (array of strings, required): Available sizes
- `colors` (array of strings, required): Available colors
- `inStock` (boolean, required): Stock availability
- `stockCount` (number, required): Number of items in stock
- `rating` (number, optional): Average rating (0-5)
- `reviewCount` (number, optional): Number of reviews
- `featured` (boolean, optional): Whether product is featured
- `createdAt` (timestamp, required): Creation date
- `updatedAt` (timestamp, required): Last update date

### 2. Categories Collection (`categories`)

Each category document should have the following structure:

```json
{
  "name": "Men",
  "slug": "men",
  "description": "Men's clothing and accessories",
  "image": "https://example.com/category-image.jpg",
  "subcategories": [
    {
      "id": "shirts",
      "name": "Shirts",
      "slug": "shirts",
      "categoryId": "men"
    }
  ]
}
```

**Fields:**
- `name` (string, required): Category name
- `slug` (string, required): URL-friendly identifier
- `description` (string, optional): Category description
- `image` (string, optional): Category image URL
- `subcategories` (array, optional): Array of subcategory objects

### 3. Users Collection (`users`)

Each user document should have the following structure:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "addresses": [
    {
      "id": "addr1",
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "isDefault": true
    }
  ],
  "createdAt": "2026-01-28T00:00:00Z",
  "updatedAt": "2026-01-28T00:00:00Z"
}
```

**Fields:**
- `email` (string, required): User email
- `name` (string, optional): User's full name
- `phone` (string, optional): Phone number
- `addresses` (array, optional): Array of address objects
- `createdAt` (timestamp, required): Account creation date
- `updatedAt` (timestamp, required): Last update date

### 4. Orders Collection (`orders`)

Each order document should have the following structure:

```json
{
  "userId": "user123",
  "items": [
    {
      "product": {
        "id": "prod1",
        "name": "Classic White T-Shirt",
        "price": 29.99,
        "images": ["https://example.com/image1.jpg"]
      },
      "quantity": 2,
      "selectedSize": "L",
      "selectedColor": "White"
    }
  ],
  "total": 59.98,
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "status": "pending",
  "paymentMethod": "stripe",
  "paymentStatus": "paid",
  "createdAt": "2026-01-28T00:00:00Z",
  "updatedAt": "2026-01-28T00:00:00Z"
}
```

**Fields:**
- `userId` (string, required): User ID who placed the order
- `items` (array, required): Array of cart items
- `total` (number, required): Total order amount
- `shippingAddress` (object, required): Shipping address
- `status` (string, required): Order status ("pending", "processing", "shipped", "delivered", "cancelled")
- `paymentMethod` (string, required): Payment method used
- `paymentStatus` (string, required): Payment status ("pending", "paid", "failed")
- `createdAt` (timestamp, required): Order creation date
- `updatedAt` (timestamp, required): Last update date

## Sample Data Script

To add sample data to Firestore, you can use the Firebase Console or create a script. Here's a sample product you can add:

### Sample Product 1: Men's T-Shirt

```javascript
{
  name: "Classic White T-Shirt",
  description: "A comfortable and stylish white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
  price: 29.99,
  originalPrice: 39.99,
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
  ],
  category: "men",
  subcategory: "shirts",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["White", "Black", "Navy"],
  inStock: true,
  stockCount: 50,
  rating: 4.5,
  reviewCount: 120,
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Sample Product 2: Women's Dress

```javascript
{
  name: "Summer Floral Dress",
  description: "A beautiful summer dress with floral pattern. Lightweight and perfect for warm weather.",
  price: 49.99,
  originalPrice: 69.99,
  images: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
  ],
  category: "women",
  subcategory: "dresses",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["Floral", "Blue", "Pink"],
  inStock: true,
  stockCount: 30,
  rating: 4.8,
  reviewCount: 85,
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Sample Category: Men

```javascript
{
  name: "Men",
  slug: "men",
  description: "Men's clothing and accessories",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
  subcategories: [
    {
      id: "shirts",
      name: "Shirts",
      slug: "shirts",
      categoryId: "men"
    },
    {
      id: "pants",
      name: "Pants",
      slug: "pants",
      categoryId: "men"
    },
    {
      id: "shoes",
      name: "Shoes",
      slug: "shoes",
      categoryId: "men"
    }
  ]
}
```

## Firestore Security Rules

Here are recommended security rules for your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read-only for all, write for admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories - read-only for all
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - users can read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Next Steps

1. Go to Firebase Console → Firestore Database
2. Create the collections: `products`, `categories`, `users`, `orders`
3. Add sample data using the structures above
4. Set up security rules in Firebase Console → Firestore → Rules
5. Test the application with real data
