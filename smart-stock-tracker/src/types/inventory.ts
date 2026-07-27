interface Product {
    id: string;
    name: string;
    quantity: number;
    expiryDate: Date;
}

interface Inventory {
    products: Product[];
}

interface LowStockProduct {
    productId: string;
    name: string;
    quantity: number;
}

interface ExpiringProduct {
    productId: string;
    name: string;
    daysRemaining: number;
}

export type { Product, Inventory, LowStockProduct, ExpiringProduct };