async function testPurchase() {
    try {
        console.log('Testing Purchase Creation...');
        const payload = {
            factoryName: 'Merinos Ana Fabrika',
            items: [
                { productId: 1, quantity: 10 }
            ]
        };

        const response = await fetch('http://localhost:3000/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testPurchase();
