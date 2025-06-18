const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env.local' });

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'gaming-marketplace';

const sampleProducts = [
  {
    title: "The Witcher 3: Wild Hunt",
    description: "A story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    price: 39.99,
    category: "PC",
    imageUrl: "/images/The-Witcher-3-Logo.png",
    rating: 4.9,
    stock: 150,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cyberpunk 2077",
    description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    price: 59.99,
    category: "PC",
    imageUrl: "/images/Cyberpunk-2077-Logo.png",
    rating: 4.2,
    stock: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minecraft",
    description: "Minecraft is a sandbox game that allows players to build constructions out of textured cubes in a 3D procedurally generated world.",
    price: 26.95,
    category: "PC",
    imageUrl: "/images/Minecraft-Logo.png",
    rating: 4.8,
    stock: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Super Mario Odyssey",
    description: "A 3D platformer for the Nintendo Switch. Mario embarks on a new journey through unknown worlds, running and jumping through huge 3D worlds.",
    price: 49.99,
    category: "Console",
    imageUrl: "/images/Super-Mario-Odyssey-Logo.png",
    rating: 4.7,
    stock: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Call of Duty: Mobile",
    description: "Call of Duty: Mobile delivers the definitive first-person action experience in a new mobile title.",
    price: 0.00,
    category: "Mobile",
    imageUrl: "/images/Call-Of-Duty-Mobile-Logo.png",
    rating: 4.1,
    stock: 999,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('games');
    
    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const result = await collection.insertMany(sampleProducts);
    console.log(`Inserted ${result.insertedCount} products`);
    
    // Display inserted products
    const products = await collection.find({}).toArray();
    console.log('Products in database:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
