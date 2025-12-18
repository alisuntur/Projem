async function testSale() {
    try {
        console.log('Testing Sale Creation...');
        const payload = {
            customerId: 1,
            items: [
                { productId: 1, quantity: 1 }
            ]
        };

        const response = await fetch('http://localhost:3000/sales', {
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

testSale();
