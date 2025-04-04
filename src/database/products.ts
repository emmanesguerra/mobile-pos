import { SQLiteDatabase } from 'expo-sqlite';

// Get all sales records
export const getProducts = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const result = await database.getAllAsync(
            `SELECT * FROM products ORDER BY id DESC;`
        );
        return result;
    } catch (error) {
        console.error('Error fetching sales records:', error);
        return [];
    }
};