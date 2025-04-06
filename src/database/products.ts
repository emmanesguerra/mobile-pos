import { SQLiteDatabase } from 'expo-sqlite';

// Get products with optional search and pagination
export const getProducts = async (database: SQLiteDatabase, searchTerm: string = '', limit: number, offset: number): Promise<any[]> => {
    try {
        let query = `
            SELECT * FROM products
            ${searchTerm ? 'WHERE product_name LIKE ?' : ''}
            ORDER BY id DESC
            LIMIT ? OFFSET ?;
        `;

        const params = searchTerm ? [`%${searchTerm}%`, limit, offset] : [limit, offset];

        const result = await database.getAllAsync(query, params);
        return result;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
export const getTotalProductsCount = async (database: SQLiteDatabase, searchTerm: string = ''): Promise<number> => {
    try {
        let query = `
            SELECT COUNT(*) as total FROM products
            ${searchTerm ? 'WHERE product_name LIKE ?' : ''}
            ORDER BY id DESC;
        `;

        const params = searchTerm ? [`%${searchTerm}%`] : [];

        const result = await database.getAllAsync(query, params) as { total: number }[];
        return result[0].total; // Return the total count
    } catch (error) {
        console.error('Error fetching products:', error);
        return 0;
    }
};

export const getLowStockProducts = async (database: SQLiteDatabase, threshold: number, searchTerm: string = ''): Promise<any[]> => {
    try {
        const query = 'SELECT * FROM products WHERE stock <= ?';
        const result = await database.getAllAsync(query, [threshold]);

        return result;
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        return [];
    }
};

export const getNonBarcodedProducts = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const query = `
            SELECT * FROM products
            WHERE isBarcoded = 0
            ORDER BY id DESC
            LIMIT 10;
        `;

        const result = await database.getAllAsync(query);
        return result;
    } catch (error) {
        console.error('Error fetching non-barcoded products:', error);
        return [];
    }
};