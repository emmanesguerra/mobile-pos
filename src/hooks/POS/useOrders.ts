import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { insertOrder, insertOrderItems } from '@/src/database/orders';
import { updateProductQuantity } from '@/src/database/products';
import { generateRefNo } from '@/src/services/refNoService';
import { useSettingsContext } from '@/src/contexts/SettingsContext';

export const useOrders = () => {
    const db = useSQLiteContext();
    const [orders, setOrders] = useState<any[]>([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const { setOrderRefresh, setProductRefresh } = useSettingsContext();

    const total = orders.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const change = paidAmount - total;

    const handleQuantityChange = (id: number, action: 'increment' | 'decrement') => {
        setOrders((prevOrders) =>
            prevOrders
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: action === 'increment' ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 0,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleClearOrder = () => {
        setOrders([]);
        setPaidAmount(0);
    };

    const handleNumericInput = (value: string) => {
        if (value === 'C') {
            setPaidAmount(0);
        } else {
            setPaidAmount((prevAmount) => (prevAmount * 10) + parseInt(value, 10));
        }
    };

    const onAddToOrder = (product: any) => {
        const exists = orders.find((o) => o.code === product.product_code);
        if (exists) {
            setOrders((prev) =>
                prev.map((item) =>
                    item.code === product.product_code ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setOrders((prev) => [
                ...prev,
                { id: product.id, code: product.product_code, name: product.product_name, quantity: 1, price: product.price },
            ]);
        }
    };

    const handleSubmitOrder = async () => {
        if (orders.length === 0) {
            alert('No items in the order.');
            return;
        }

        try {
            const refNo = await generateRefNo(db);
            const orderId = await insertOrder(db, refNo, total, paidAmount);
            if (!orderId) return;

            const orderItems = orders.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));

            await insertOrderItems(db, orderId, orderItems);
            await updateProductQuantity(db, orderItems);

            setOrderRefresh(true);
            setProductRefresh(true);
            handleClearOrder();
            alert('Order submitted successfully!');
        } catch (error) {
            alert('Failed to submit order. Please try again.');
        }
    };

    return {
        orders,
        paidAmount,
        total,
        change,
        setPaidAmount,
        handleQuantityChange,
        handleClearOrder,
        handleNumericInput,
        handleSubmitOrder,
        onAddToOrder,
    };
};
