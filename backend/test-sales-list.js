async function testSalesList() {
    try {
        console.log('Testing Sales List API...');
        const url = 'http://localhost:3000/sales?page=1&limit=10';
        console.log(`Fetching: ${url}`);

        const res = await fetch(url);
        if (!res.ok) {
            console.error('Error Status:', res.status);
            const text = await res.text();
            console.error('Error Body:', text);
            return;
        }

        const json = await res.json();
        console.log('Response Structure:', Object.keys(json));
        console.log('Total Records:', json.total);
        console.log('Data Length:', json.data?.length);

        if (json.data && json.data.length > 0) {
            console.log('First Record:', JSON.stringify(json.data[0], null, 2));
        } else {
            console.log('No data found in response.');
        }

    } catch (error) {
        console.error('Fetch Failed:', error);
    }
}

testSalesList();
