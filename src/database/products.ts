import { SQLiteDatabase } from 'expo-sqlite';
import { Product } from '@/src/interfaces/Product';

// Get products with optional search and pagination
export const getProducts = async (database: SQLiteDatabase, searchTerm: string = '', limit: number, offset: number): Promise<any[]> => {
    try {
        let query = `
            SELECT * FROM products
            ${searchTerm ? 'WHERE (product_name LIKE ? OR product_code LIKE ?)' : ''}
            ORDER BY id DESC
            LIMIT ? OFFSET ?;
        `;

        const params = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : [limit, offset];

        const result = await database.getAllAsync(query, params);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getTotalProductsCount = async (database: SQLiteDatabase, searchTerm: string = ''): Promise<number> => {
    try {
        let query = `
            SELECT COUNT(*) as total FROM products
            ${searchTerm ? 'WHERE product_name LIKE ?' : ''};
        `;

        const params = searchTerm ? [`%${searchTerm}%`] : [];

        const result = await database.getAllAsync(query, params) as { total: number }[];
        return result[0].total; // Return the total count
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (database: SQLiteDatabase, id: number): Promise<Product | undefined> => {
    const result = await database.getFirstAsync(
        'SELECT * FROM products WHERE id = ?',
        [id]
    );

    return result as Product | undefined;
}

export const getProductByCode = async (database: SQLiteDatabase, code: string): Promise<Product | undefined> => {
    const result = await database.getFirstAsync(
        'SELECT * FROM products WHERE product_code = ?',
        [code]
    );

    return result as Product | undefined;
}

export const getLowStockProducts = async (database: SQLiteDatabase, threshold: number, searchTerm: string = ''): Promise<any[]> => {
    try {
        const query = 'SELECT * FROM products WHERE stock <= ?';
        const result = await database.getAllAsync(query, [threshold]);

        return result;
    } catch (error) {
        throw error;
    }
};

export const getNonBarcodedProducts = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const query = `
            SELECT * FROM products
            WHERE isBarcoded = 0
            ORDER BY id DESC;
        `;

        const result = await database.getAllAsync(query);
        return result;
    } catch (error) {
        throw error;
    }
};

export const insertProduct = async (
    database: SQLiteDatabase,
    productCode: string,
    productName: string,
    stock: number,
    price: number,
    isBarcoded: number,
    bgColor: string
) => {
    try {
        await database.runAsync(
            'INSERT INTO products (product_code, product_name, stock, price, isBarcoded, bgColor) VALUES (?, ?, ?, ?, ?, ?);',
            [productCode, productName, stock, price, isBarcoded, bgColor]
        );
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (
    database: SQLiteDatabase,
    id: number,
    productName: string,
    stock: number,
    price: number,
    bgColor: string
): Promise<boolean> => {
    try {
        // SQL query to update the product details
        const query = `
        UPDATE products
        SET 
          product_name = ?, 
          stock = ?, 
          price = ?, 
          bgColor = ?, 
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;

        // Execute the query with the provided values
        await database.runAsync(query, [
            productName,
            stock,
            price,
            bgColor,
            id,
        ]);

        return true;
    } catch (error) {
        throw error;
    }
};

export const updateProductQuantity = async (
    database: SQLiteDatabase,
    orderItems: { product_id: number; quantity: number }[]
): Promise<boolean> => {
    try {
        for (const item of orderItems) {
            await database.runAsync(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }
        return true;
    } catch (error) {
        throw error;
    }
};