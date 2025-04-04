import { SQLiteDatabase } from 'expo-sqlite';

// Get all sales records
export const getOrders = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const result = await database.getAllAsync(
            `SELECT * FROM orders ORDER BY id DESC;`
        );
        return result;
    } catch (error) {
        console.error('Error fetching sales records:', error);
        return [];
    }
};

export const getOrderItems = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const result = await database.getAllAsync(
            `SELECT * FROM order_items ORDER BY id DESC;`
        );
        return result;
    } catch (error) {
        console.error('Error fetching sales records:', error);
        return [];
    }
};