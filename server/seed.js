const { adminDb } = require('./firebase');
const admin = require('firebase-admin');

const seedData = async () => {
  // Deleting existing data
  const categoriesRef = adminDb.collection('categories');
  const productsRef = adminDb.collection('products');

  const deleteCollection = async (ref) => {
    const snapshot = await ref.get();
    const batch = adminDb.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  };
  await deleteCollection(productsRef);
  await deleteCollection(categoriesRef);
  console.log('Existing data deleted');

  try {
    // Seed Categories
    const categories = [
      {
        name: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
      },
      {
        name: 'Clothes',
        image:
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
      },
      {
        name: 'Furniture',
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
      },
      {
        name: 'Books',
        image:
          'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
      },
      {
        name: 'Toys',
        image:
          'https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
      },
    ];

    const categoryRefs = [];
    for (const category of categories) {
      const docRef = await adminDb.collection('categories').add({
        ...category,
        creationAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      categoryRefs.push({ id: docRef.id, ...category });
    }

    // Seed Products
    const products = [
      {
        title: 'Smartphone X1',
        price: 699,
        description: 'High-performance smartphone with 5G.',
        categoryId: categoryRefs[0].id,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Leather Jacket',
        price: 199,
        description: 'Stylish leather jacket for all seasons.',
        categoryId: categoryRefs[1].id,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Wooden Table',
        price: 299,
        description: 'Handmade wooden table for dining.',
        categoryId: categoryRefs[2].id,
        images: [
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Sci-Fi Novel',
        price: 15,
        description: 'A thrilling sci-fi adventure.',
        categoryId: categoryRefs[3].id,
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Robot Toy',
        price: 25,
        description: 'Interactive robot toy for kids.',
        categoryId: categoryRefs[4].id,
        images: [
          'https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Laptop Pro',
        price: 1299,
        description: 'Powerful laptop for professionals.',
        categoryId: categoryRefs[0].id,
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Winter Coat',
        price: 249,
        description: 'Warm coat for winter.',
        categoryId: categoryRefs[1].id,
        images: [
          'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Bookshelf',
        price: 149,
        description: 'Modern bookshelf for home.',
        categoryId: categoryRefs[2].id,
        images: [
          'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'History Book',
        price: 20,
        description: 'Detailed history of the 20th century.',
        categoryId: categoryRefs[3].id,
        images: [
          'https://images.unsplash.com/photo-1515325595179-59cd5262ca53?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Puzzle Game',
        price: 10,
        description: 'Challenging puzzle for kids.',
        categoryId: categoryRefs[4].id,
        images: [
          'https://images.unsplash.com/photo-1643340126375-25b57da53716?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Smartwatch',
        price: 199,
        description: 'Fitness tracking smartwatch.',
        categoryId: categoryRefs[0].id,
        images: [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Denim Jeans',
        price: 59,
        description: 'Comfortable denim jeans.',
        categoryId: categoryRefs[1].id,
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Sofa Set',
        price: 799,
        description: 'Luxurious sofa set for living room.',
        categoryId: categoryRefs[2].id,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Fantasy Novel',
        price: 18,
        description: 'Epic fantasy tale.',
        categoryId: categoryRefs[3].id,
        images: [
          'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Action Figure',
        price: 30,
        description: 'Superhero action figure.',
        categoryId: categoryRefs[4].id,
        images: [
          'https://images.unsplash.com/photo-1561149877-84d268ba65b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Headphones',
        price: 99,
        description: 'Noise-cancelling headphones.',
        categoryId: categoryRefs[0].id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Dress',
        price: 89,
        description: 'Trendy dress for casual wear.',
        categoryId: categoryRefs[1].id,
        images: [
          'https://images.unsplash.com/photo-1632262050371-61d44b6ef8e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Coffee Table',
        price: 129,
        description: 'Stylish coffee table for living room.',
        categoryId: categoryRefs[2].id,
        images: [
          'https://images.unsplash.com/photo-1645354114738-781616b92c08?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Cookbook',
        price: 25,
        description: 'Recipes for beginners.',
        categoryId: categoryRefs[3].id,
        images: [
          'https://images.unsplash.com/photo-1627907228175-2bf846a303b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
      {
        title: 'Board Game',
        price: 40,
        description: 'Family-friendly board game.',
        categoryId: categoryRefs[4].id,
        images: [
          'https://images.unsplash.com/photo-1585504198199-20277593b94f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&h=480&q=80',
        ],
      },
    ];

    for (const product of products) {
      await adminDb.collection('products').add({
        ...product,
        creationAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData();
