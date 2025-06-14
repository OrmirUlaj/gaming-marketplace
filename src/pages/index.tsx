// pages/index.tsx

import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import clientPromise from '../lib/mongodb'

export interface Game {
  _id: string
  title: string
  description: string
  price: number
  imageUrl: string
}

export const getServerSideProps: GetServerSideProps<{ games: Game[] }> = async () => {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const docs = await db
    .collection('games')
    .find({})
    .sort({ title: 1 })
    .toArray()

  const games: Game[] = docs.map(doc => ({
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    imageUrl: doc.imageUrl,
  }))

  return { props: { games } }
}

const Marketplace: NextPage<{ games: Game[] }> = ({ games }) => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', marginBottom: '1.5rem' }}>🎮 Gaming Marketplace</h1>

      {games.length === 0 ? (
        <p style={{ color: '#ccc' }}>No games available right now—try adding some in MongoDB Compass!</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {games.map(game => (
            <div
              key={game._id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1rem', flexGrow: 1, color: '#333' }}>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#111' }}>
                  {game.title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 1rem' }}>
                  {game.description}
                </p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#111' }}>
                  ${game.price.toFixed(2)}
                </p>
              </div>
              <button
                style={{
                  margin: '1rem',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  backgroundColor: '#0070f3',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
                onClick={() => alert(`Added "${game.title}" to cart!`)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Marketplace