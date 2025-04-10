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
                bgColor TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ref_no TEXT,
                total REAL,
                paidAmount REAL,
                note TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT
            );
          
            INSERT OR IGNORE INTO settings (key, value)
            VALUES 
              ('lowStockThreshold', '5'),
              ('tableRows', '9');
            `
        );

    } catch (error) {
        alert('An error occurred while initializing the database. Please try again later.');
    }
};

export const dropDatabase = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync(`DROP TABLE IF EXISTS order_items;`);
        await database.execAsync(`DROP TABLE IF EXISTS orders;`);
        await database.execAsync(`DROP TABLE IF EXISTS products;`);
        await database.execAsync(`DROP TABLE IF EXISTS settings;`);

    } catch (error) {
        alert('An error occurred while initializing the database. Please try again later.');
    }
};