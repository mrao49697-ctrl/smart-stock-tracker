import { NextResponse } from 'next/server';
import { getInventory, getLowStockProducts, getExpiringProducts } from '../../../lib/supabase';

export async function GET(request: Request) {
    try {
        const inventory = await getInventory();
        const lowStockProducts = await getLowStockProducts();
        const expiringProducts = await getExpiringProducts();

        return NextResponse.json({
            inventory,
            lowStockProducts,
            expiringProducts,
        });
    } catch (error) {
        return NextResponse.error();
    }
}