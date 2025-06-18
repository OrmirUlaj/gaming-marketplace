import clientPromise from '../mongodb';

export async function setupCollectionValidation() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

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