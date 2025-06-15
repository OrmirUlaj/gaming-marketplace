export interface Cart {
  id: string;
  userId: string;
  items: {
    gameId: string;
    quantity: number;
  }[];
  updatedAt: Date;
}
