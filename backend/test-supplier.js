async function testSupplierModule() {
    try {
        console.log('Testing Supplier Module...');

        // 1. Create Supplier
        const supplierRes = await fetch('http://localhost:3000/suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Factory', type: 'Factory' })
        });
        const supplier = await supplierRes.json();
        console.log(`Created Supplier ID: ${supplier.id}`);

        // 2. Get a Product (ID 1)
        const productRes = await fetch('http://localhost:3000/products/1');
        const product = await productRes.json();
        const productId = product.id;

        // 3. Add Product to Supplier
        console.log(`Associating Product ${productId} with Supplier ${supplier.id}...`);
        await fetch(`http://localhost:3000/suppliers/${supplier.id}/products/${productId}`, { method: 'POST' });

        // 4. Test Filtering
        console.log('Fetching products for this supplier...');
        const filteredRes = await fetch(`http://localhost:3000/products?supplierId=${supplier.id}`);
        const filteredProducts = await filteredRes.json();

        console.log('Filtered Count:', filteredProducts.length);
        if (filteredProducts.length === 1 && filteredProducts[0].id === productId) {
            console.log('PASS: Correct product returned.');
        } else {
            console.error('FAIL: Filter logic incorrect.', filteredProducts);
        }

        // 5. Test Filtering (Wrong Supplier)
        const wrongRes = await fetch(`http://localhost:3000/products?supplierId=99999`);
        const wrongProducts = await wrongRes.json();
        if (wrongProducts.length === 0) {
            console.log('PASS: Empty list for wrong supplier.');
        } else {
            console.error('FAIL: Should be empty.', wrongProducts);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testSupplierModule();
