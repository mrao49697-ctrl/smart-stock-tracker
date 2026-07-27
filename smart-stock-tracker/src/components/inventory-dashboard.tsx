import React, { useEffect, useState } from 'react';
import { fetchInventoryData } from '../lib/supabase';

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getInventoryData = async () => {
            try {
                const data = await fetchInventoryData();
                setInventory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getInventoryData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const lowStockItems = inventory.filter(item => item.quantity < 5);
    const expiringSoon = inventory.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysRemaining = (expiryDate - today) / (1000 * 60 * 60 * 24);
        return daysRemaining >= 0 && daysRemaining <= 30;
    });

    return (
        <div>
            <h1>Inventory Dashboard</h1>
            <h2>Low Stock Items</h2>
            <ul>
                {lowStockItems.map(item => (
                    <li key={item.id}>{item.name} - {item.quantity} left</li>
                ))}
            </ul>
            <h2>Expiring Soon</h2>
            <ul>
                {expiringSoon.map(item => (
                    <li key={item.id}>{item.name} - expires in {Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days</li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryDashboard;