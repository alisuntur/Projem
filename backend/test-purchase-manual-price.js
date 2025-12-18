async function testManualPricePurchase() {
    try {
        console.log('Testing Manual Price Purchase...');

        // 1. Create Purchase with Manual Price
        const payload = {
            factoryName: 'Test Factory Manual Price',
            items: [
                {
                    productId: 1,
                    quantity: 10,
                    unitPrice: 100 // Manually set price (assuming default might be different)
                }
            ]
        };
        console.log('Sending Payload:', payload);

        const createRes = await fetch('http://localhost:3000/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) throw new Error(await createRes.text());
        const purchase = await createRes.json();

        console.log('Created Purchase:', {
            id: purchase.id,
            totalAmount: purchase.totalAmount,
            items: purchase.items.map(i => ({
                productSku: i.productSku,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice
            }))
        });

        // Verify logic
        const expectedTotal = 1000; // 10 * 100
        if (Number(purchase.totalAmount) === expectedTotal) {
            console.log('SUCCESS: Manual price respected.');
        } else {
            console.error('FAILURE: Manual price ignored.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testManualPricePurchase();
