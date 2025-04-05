import { SQLiteDatabase } from 'expo-sqlite';

// Get all settings (for listing)
export const getSettings = async (database: SQLiteDatabase): Promise<any[]> => {
    try {
        const result = await database.getAllAsync(`SELECT * FROM settings`);
        return result;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return [];
    }
};

// Get a specific setting value by key
export const getSettingValue = async (database: SQLiteDatabase, key: string): Promise<string | null> => {
    try {
        const result = await database.getFirstAsync<{ value: string }>(
            `SELECT value FROM settings WHERE key = ?`,
            [key]
        );
        return result?.value ?? null;
    } catch (error) {
        console.error(`Error fetching setting for key "${key}":`, error);
        return null;
    }
};

// Create a new key-value setting
export const createSetting = async (database: SQLiteDatabase, key: string, value: string): Promise<boolean> => {
    try {
        await database.runAsync(
            `INSERT INTO settings (key, value) VALUES (?, ?)`,
            [key, value]
        );
        return true;
    } catch (error) {
        console.error(`Error inserting setting "${key}":`, error);
        return false;
    }
};

// Update an existing setting
export const updateSetting = async (database: SQLiteDatabase, key: string, value: string): Promise<boolean> => {
    try {
        await database.runAsync(
            `UPDATE settings SET value = ? WHERE key = ?`,
            [value, key]
        );
        return true;
    } catch (error) {
        console.error(`Error updating setting "${key}":`, error);
        return false;
    }
};

export const saveSetting = async (database: SQLiteDatabase, key: string, value: string): Promise<boolean> => {
    try {
        const existing = await getSettingValue(database, key);
        if (existing !== null) {
            return await updateSetting(database, key, value);
        } else {
            return await createSetting(database, key, value);
        }
    } catch (error) {
        console.error(`Error upserting setting "${key}":`, error);
        return false;
    }
};
