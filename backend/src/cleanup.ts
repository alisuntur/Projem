
import { DataSource } from "typeorm";
import { Customer } from "./customers/customer.entity";
import 'dotenv/config';

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || '5432') || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "stitch_db",
    entities: [Customer],
    synchronize: false,
});

async function cleanup() {
    await dataSource.initialize();
    console.log("Connected to DB");

    const repo = dataSource.getRepository(Customer);

    // 1. Delete empty names
    const emptyCustomers = await repo.createQueryBuilder('customer')
        .where("customer.name IS NULL OR customer.name = ''")
        .getMany();

    console.log(`Found ${emptyCustomers.length} empty customers. Deleting...`);
    if (emptyCustomers.length > 0) {
        await repo.remove(emptyCustomers);
    }

    // 2. Find and delete duplicates (keep latest or earliest? usually keep earliest id)
    // Simple dedupe by name
    const allCustomers = await repo.find();
    const seenNames = new Set();
    const toDelete: Customer[] = [];

    // Sort by ID so we keep the first one
    allCustomers.sort((a, b) => a.id - b.id);

    for (const c of allCustomers) {
        if (c.name && seenNames.has(c.name.trim().toLowerCase())) {
            toDelete.push(c);
        } else if (c.name) {
            seenNames.add(c.name.trim().toLowerCase());
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
