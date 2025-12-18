async function testStockReversion() {
    try {
        console.log('Testing Stock Reversion...');

        // 1. Create a Purchase (Qty: 10)
        // Ensure we use a product we know, e.g. ID 1
        const createRes = await fetch('http://localhost:3000/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                factoryName: 'Stock Test Factory',
                items: [{ productId: 1, quantity: 10 }]
            })
        });
        const purchase = await createRes.json();
        const id = purchase.id;
        console.log(`Created Purchase ${id}. Qty: 10`);

        // Check Initial Stock
        const getProduct = async () => (await fetch('http://localhost:3000/products/1')).json();
        let product = await getProduct();
        const initialStock = product.stock;
        console.log('Initial Stock:', initialStock);

        // 2. Set Status to 'Teslim Alındı' (Should Increase Stock)
        console.log("Setting status to 'Teslim Alındı'...");
        await fetch(`http://localhost:3000/purchases/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Teslim Alındı' })
        });

        product = await getProduct();
        console.log('Stock after Receive:', product.stock);
        if (product.stock !== initialStock + 10) console.error('FAIL: Stock used not increase!');
        else console.log('PASS: Stock increased.');

        // 3. Revert Status to 'Yolda' (Should Decrease Stock)
        console.log("Reverting status to 'Yolda'...");
        await fetch(`http://localhost:3000/purchases/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Yolda' })
        });

        product = await getProduct();
        console.log('Stock after Revert:', product.stock);
        if (product.stock !== initialStock) console.error('FAIL: Stock did not revert!');
        else console.log('PASS: Stock reverted correctly.');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testStockReversion();
