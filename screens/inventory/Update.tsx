import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import ProductForm from '@/components/ProductForm';
import { useSQLiteContext } from 'expo-sqlite';
import { getProductById, updateProduct } from '@/src/database/products';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

type BarcodedFormData = {
    code: string;
    name: string;
    price: string;
    stock: string;
};

type GeneralFormData = {
    name: string;
    price: string;
    stock: string;
    bgColor: string;
};

export default function InventoryEdit() {
    const { id } = useLocalSearchParams(); 
    const productId = Number(id);
    const database = useSQLiteContext();
    const { setProductRefresh } = useSettingsContext();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [barcodedForm, setBarcodedForm] = useState({ code: '', name: '', price: '', stock: '' });
    const [generalForm, setGeneralForm] = useState({ code: '', name: '', price: '', bgColor: '', stock: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            const result = await getProductById(database, Number(id));

            // Safely handle if the product doesn't exist
            if (result) {
                setProduct(result);

                if (result.isBarcoded === 1) {
                    setBarcodedForm({
                        code: result.product_code,
                        name: result.product_name,
                        price: result.price.toString(),
                        stock: result.stock.toString(),
                    });
                } else {
                    setGeneralForm({
                        code: result.product_code,
                        name: result.product_name,
                        price: result.price.toString(),
                        stock: result.stock.toString(),
                        bgColor: result.bgColor || '', // Handle case where bgColor might be undefined
                    });
                }
            } else {
                console.error('Product not found');
            }
        };

        fetchProduct();
    }, [id, database]);

    const handleSubmit = async (formData: any, isBarcoded: boolean) => {

        await updateProduct(database, productId, formData.name, formData.stock, formData.price, formData.bgColor);
        setProductRefresh(true);
        router.push('/inventory-list');
    };

    if (!product) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: product?.isBarcoded ? '#D0E8C5' : '#FADADD' }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {product.isBarcoded === 1 ? (
                    <ProductForm
                        title="Edit Barcoded Product"
                        formData={barcodedForm}
                        setFormData={setBarcodedForm}
                        backgroundColor="#D0E8C5"
                        fields={[
                            { key: 'code', placeholder: 'Product Code', keyboardType: 'default', disabled: true },
                            { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
                            { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
                            { key: 'stock', placeholder: 'Stock', keyboardType: 'numeric' },
                        ]}
                        action="Update"
                        onSubmit={(data: BarcodedFormData) => handleSubmit(data, true)}
                        withCamera={true}
                    />
                ) : (
                    <ProductForm
                        title="Edit General Product"
                        formData={generalForm}
                        setFormData={setGeneralForm}
                        backgroundColor="#FADADD"
                        fields={[
                            { key: 'code', placeholder: 'Product Code', keyboardType: 'default', disabled: true },
                            { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
                            { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
                            { key: 'stock', placeholder: 'Stock', keyboardType: 'numeric' },
                            { key: 'bgColor', placeholder: 'Background Color', keyboardType: 'picker' },
                        ]}
                        action="Update"
                        onSubmit={(data: GeneralFormData) => handleSubmit(data, false)}
                        withCamera={false}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContainer: {
        flexGrow: 1,
        width: 750,
    },
});
