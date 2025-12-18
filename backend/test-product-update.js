async function testProductUpdate() {
    try {
        console.log('Testing Product Update...');
        // 1. Get a product to update (e.g., ID 1 or create one)
        // Let's assume ID 1 exists from seed
        const id = 1;

        // 2. Initial State
        // const initialRes = await fetch(`http://localhost:3000/products/${id}`);
        // const initialProduct = await initialRes.json();
        // console.log('Initial Price:', initialProduct.price);

        // 3. Update
        const payload = {
            price: 1549.99,
            stock: 42,
            size: '200x290'
        };
        console.log('Updating to:', payload);

        const updateRes = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!updateRes.ok) throw new Error(await updateRes.text());
        const updatedProduct = await updateRes.json();

        console.log('Updated Product:', {
            id: updatedProduct.id,
            price: updatedProduct.price,
            stock: updatedProduct.stock,
            size: updatedProduct.size
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testProductUpdate();
