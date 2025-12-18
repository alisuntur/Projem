"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customers/customer.entity");
require("dotenv/config");
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "stitch_db",
    entities: [customer_entity_1.Customer],
    synchronize: false,
});
async function cleanup() {
    await dataSource.initialize();
    console.log("Connected to DB");
    const repo = dataSource.getRepository(customer_entity_1.Customer);
    const emptyCustomers = await repo.createQueryBuilder('customer')
        .where("customer.name IS NULL OR customer.name = ''")
        .getMany();
    console.log(`Found ${emptyCustomers.length} empty customers. Deleting...`);
    if (emptyCustomers.length > 0) {
        await repo.remove(emptyCustomers);
    }
    const allCustomers = await repo.find();
    const seen, names = new Set();
    const toDelete = [];
    allCustomers.sort((a, b) => a.id - b.id);
    for (const c of allCustomers) {
        if (c.name && seen.has(c.name.trim().toLowerCase())) {
            toDelete.push(c);
        }
        else if (c.name) {
            seen.add(c.name.trim().toLowerCase());
        }
    }
    console.log(`Found ${toDelete.length} duplicate customers. Deleting...`);
    if (toDelete.length > 0) {
        await repo.remove(toDelete);
    }
    console.log("Cleanup complete");
    await dataSource.destroy();
}
cleanup().catch(console.error);
//# sourceMappingURL=cleanup.js.map