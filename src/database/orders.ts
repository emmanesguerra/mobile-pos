import { SQLiteDatabase } from 'expo-sqlite';

// Get all sales records
export const getOrders = async (database: SQLiteDatabase, searchTerm: string = '', limit: number, offset: number): Promise<any[]> => {
    try {
        let query = `
            SELECT * FROM orders
            ${searchTerm ? 'WHERE ref_no LIKE ?' : ''}
            ORDER BY id DESC
            LIMIT ? OFFSET ?;
        `;

        const params = searchTerm ? [`%${searchTerm}%`, limit, offset] : [limit, offset];

        const result = await database.getAllAsync(query, params);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getOrderItems = async (database: SQLiteDatabase, orderId: number): Promise<any[]> => {
    try {
        // Fetch order items and join with the products table to get product details
        const result = await database.getAllAsync(
            `SELECT oi.id, oi.product_id, p.product_name, oi.price, oi.quantity
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
                ORDER BY oi.id DESC;`,
            [orderId] // Parameterized query to safely insert orderId
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const getTotalOrders = async (database: SQLiteDatabase, searchTerm: string = ''): Promise<number> => {
    try {
        let query = `
            SELECT COUNT(*) as total FROM orders
            ${searchTerm ? 'WHERE ref_no LIKE ?' : ''};
        `;

        const params = searchTerm ? [`%${searchTerm}%`] : [];

        const result = await database.getAllAsync(query, params) as { total: number }[];
        return result[0].total; // Return the total count
    } catch (error) {
        throw error;
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
        throw error;
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
        throw error;
    }
};

export const updateOrder = async (
    database: SQLiteDatabase,
    orderId: number,
    paidAmount: number,
    note: string
): Promise<boolean> => {
    try {
        // SQL query to update the paidAmount, note, and updated_at fields
        const result = await database.runAsync(
            `UPDATE orders 
         SET paidAmount = ?, note = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?;`,
            [paidAmount, note, orderId]
        );

        if (result.changes > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
};