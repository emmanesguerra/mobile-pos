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

export const getTotalOrders = async (database: SQLiteDatabase, searchTerm: string = ''): Promise<number> => {
    try {
        let query = `
            SELECT COUNT(*) as total FROM orders
            ${searchTerm ? 'WHERE ref_code LIKE ?' : ''};
        `;

        const params = searchTerm ? [`%${searchTerm}%`] : [];

        const result = await database.getAllAsync(query, params) as { total: number }[];
        return result[0].total; // Return the total count
    } catch (error) {
        console.error('Error fetching products:', error);
        return 0;
    }
};

export const insertOrder = async (
    database: SQLiteDatabase,
    ref_no: string,
    total: number,
    paidAmount: number
): Promise<number | null> => {
    try {
        const result = await database.runAsync(
            `INSERT INTO orders (ref_no, total, paidAmount) VALUES (?, ?, ?);`,
            [ref_no, total, paidAmount]
        );

        return result.lastInsertRowId ?? null;
    } catch (error) {
        console.error('Error inserting order:', error);
        return null;
    }
};

interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}

export const insertOrderItems = async (
    database: SQLiteDatabase,
    order_id: number,
    items: OrderItem[]
): Promise<boolean> => {
    try {
        for (const item of items) {
            await database.runAsync(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
                [order_id, item.product_id, item.quantity, item.price]
            );
        }
        return true;
    } catch (error) {
        console.error('Error inserting order items:', error);
        return false;
    }
};