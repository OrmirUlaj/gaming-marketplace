import clientPromise from '../mongodb';

export async function setupCollectionValidation() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  // Users Collection Validation
  // await db.command({
  //   collMod: 'users',
  //   validator: {
  //     $jsonSchema: {
  //       bsonType: 'object',
  //       required: ['name', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
  //       properties: {
  //         name: { bsonType: 'string' },
  //         email: { bsonType: 'string' },
  //         password: { bsonType: 'string' },
  //         role: { enum: ['user', 'admin'] },
  //         createdAt: { bsonType: 'date' },
  //         updatedAt: { bsonType: 'date' }
  //       },
  //       additionalProperties: true
  //     }
  //   }
  // });

  // Orders Collection Validation
  await db.command({
    collMod: 'orders',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'items', 'total', 'status', 'createdAt', 'updatedAt'],
        properties: {
          userId: { bsonType: 'objectId' },
          items: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['gameId', 'quantity', 'price'],
              properties: {
                gameId: { bsonType: 'objectId' },
                quantity: { bsonType: 'number', minimum: 1 },
                price: { bsonType: 'number', minimum: 0 }
              }
            }
          },
          total: { bsonType: 'number', minimum: 0 },
          status: { enum: ['pending', 'completed', 'cancelled'] },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  });

  // Reviews Collection Validation
  await db.command({
    collMod: 'reviews',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'gameId', 'rating', 'comment', 'createdAt', 'updatedAt'],
        properties: {
          userId: { bsonType: 'objectId' },
          gameId: { bsonType: 'objectId' },
          rating: { bsonType: 'number', minimum: 1, maximum: 5 },
          comment: { bsonType: 'string' },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  });

  // Cart Collection Validation
  await db.command({
    collMod: 'cart',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'items', 'updatedAt'],
        properties: {
          userId: { bsonType: 'objectId' },
          items: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['gameId', 'quantity'],
              properties: {
                gameId: { bsonType: 'objectId' },
                quantity: { bsonType: 'number', minimum: 1 }
              }
            }
          },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  });
}