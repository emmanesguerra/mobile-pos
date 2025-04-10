import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getNonBarcodedProducts, getProductByCode } from '@/src/database/products';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import { Product } from '@/src/interfaces/Product';

export const useProducts = () => {
    const db = useSQLiteContext();
    const [products, setProducts] = useState<Product[]>([]);
    const { productRefresh, setProductRefresh } = useSettingsContext();

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getNonBarcodedProducts(db);
                setProducts(result);
            } catch (error) {
                alert('Error fetching non-barcoded products:' + error);
            }
        };

        fetch();
        setProductRefresh(false);
    }, [productRefresh]);
    
    const getProductByCodeFromDB = async (code: string): Promise<Product | undefined> => {
        try {
            const product = await getProductByCode(db, code);
            return product;
        } catch (error) {
            return undefined;
        }
    };

    return {
        products,
        getProductByCodeFromDB,
    };
};
