async function testStatusUpdate() {
    try {
        console.log('Testing Status Update...');
        // First create a new purchase to get an ID (or assuming one exists from previous test)
        // Let's create one quickly
        const createRes = await fetch('http://localhost:3000/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ factoryName: 'Test Factory', items: [{ productId: 1, quantity: 5 }] })
        });
        const purchase = await createRes.json();
        const id = purchase.id;
        console.log('Created Purchase ID:', id);

        // Now Update Status to 'Yolda'
        console.log('Updating status to Yolda...');
        const updateRes = await fetch(`http://localhost:3000/purchases/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Yolda' })
        });

        if (!updateRes.ok) throw new Error(await updateRes.text());
        const updatedPurchase = await updateRes.json();

        console.log('Updated Status:', updatedPurchase.status);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testStatusUpdate();
