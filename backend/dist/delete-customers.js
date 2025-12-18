"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("dotenv/config");
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || '5432') || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "Bayi",
    synchronize: false,
});
async function deleteCustomers() {
    await dataSource.initialize();
    console.log("Connected to DB");
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const customersToDelete = await queryRunner.query(`
            SELECT id, name, balance FROM customers 
            WHERE name LIKE '%Yılmaz Halı%' 
            OR name LIKE '%Test Acente%'
        `);
        console.log("Found customers to delete:", customersToDelete);
        for (const customer of customersToDelete) {
            const id = customer.id;
            console.log(`\nDeleting customer: ${customer.name} (ID: ${id}, Balance: ${customer.balance})`);
            const itemsResult = await queryRunner.query(`
                DELETE FROM sale_items 
                WHERE "sale_id" IN (SELECT id FROM sales WHERE "customer_id" = $1)
            `, [id]);
            console.log(`  - Deleted sale items`);
            await queryRunner.query(`DELETE FROM sales WHERE "customer_id" = $1`, [id]);
            console.log(`  - Deleted sales`);
            await queryRunner.query(`DELETE FROM payments WHERE "partyId" = $1 AND "partyType" = 'customer'`, [id]);
            console.log(`  - Deleted payments`);
            await queryRunner.query(`DELETE FROM customers WHERE id = $1`, [id]);
            console.log(`  - Deleted customer record`);
        }
        await queryRunner.commitTransaction();
        console.log("\n✅ All customers deleted successfully!");
    }
    catch (err) {
        console.error("\n❌ DELETE ERROR:", err);
        await queryRunner.rollbackTransaction();
    }
    finally {
        await queryRunner.release();
        await dataSource.destroy();
    }
}
deleteCustomers();
//# sourceMappingURL=delete-customers.js.map