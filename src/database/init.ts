import { SQLiteDatabase } from 'expo-sqlite';

export const initializeDatabase = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_code TEXT UNIQUE,
                product_name TEXT,
                stock INTEGER,
                price REAL,
                isBarcoded INTEGER CHECK(isBarcoded IN (0,1)),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ref_code TEXT,
                total REAL,
                date TEXT DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                price REAL,
                FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products (id)
            );
            `
        );


        // Insert dummy data into 'products' table
        await database.execAsync(`
            INSERT OR IGNORE INTO products (product_code, product_name, stock, price, isBarcoded)
            VALUES
            ('P001', 'Product 1', 50, 100.0, 1),
            ('P002', 'Product 2', 30, 200.0, 1),
            ('P003', 'Product 3', 20, 150.0, 0),
            ('P004', 'Product 4', 10, 250.0, 1);
        `);

        // Insert dummy data into 'orders' table
        await database.execAsync(`
            INSERT OR IGNORE INTO orders (ref_code, total)
            VALUES
            (0404251001, 400.0),
            (0404251002, 450.0),
            (0404251003, 250.0);
        `);

        // Insert dummy data into 'order_items' table
        await database.execAsync(`
            INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price)
            VALUES
            (1, 1, 2, 100.0), 
            (1, 2, 1, 200.0),
            (2, 3, 3, 150.0),
            (3, 4, 1, 250.0); 
        `);


        console.log('DB tables created successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};
