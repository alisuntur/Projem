"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "Bayi",
    synchronize: false,
});
async function clearSales() {
    await dataSource.initialize();
    console.log("Connected to DB");
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const itemsResult = await queryRunner.query(`DELETE FROM sale_items`);
        console.log("Deleted all sale_items");
        const salesResult = await queryRunner.query(`DELETE FROM sales`);
        console.log("Deleted all sales");
        await queryRunner.commitTransaction();
        console.log("\n✅ Tüm satışlar temizlendi!");
    }
    catch (err) {
        console.error("Error:", err);
        await queryRunner.rollbackTransaction();
    }
    finally {
        await queryRunner.release();
        await dataSource.destroy();
    }
}
clearSales();
//# sourceMappingURL=clear-sales.js.map