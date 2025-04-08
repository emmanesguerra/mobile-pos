import { getTotalOrders } from '@/src/database/orders';
import { SQLiteDatabase } from 'expo-sqlite';

export const generateRefNo = async (database: SQLiteDatabase): Promise<string> => {
  const now = new Date();

  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();

  // Fetch total orders to generate the next order number
  const count = await getTotalOrders(database);
  const paddedCount = String(count + 1).padStart(7, '0');

  return `ORD${mm}${dd}${yyyy}${paddedCount}`;
};
