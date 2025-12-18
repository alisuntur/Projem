"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const customers_service_1 = require("./customers/customers.service");
const products_service_1 = require("./products/products.service");
const customer_entity_1 = require("./customers/customer.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const customerService = app.get(customers_service_1.CustomersService);
    const productService = app.get(products_service_1.ProductsService);
    console.log('Seeding Customers...');
    await customerService.create({
        name: 'Ahmet Yılmaz',
        type: customer_entity_1.CustomerType.INDIVIDUAL,
        city: 'İstanbul',
        phone: '0555 111 22 33',
        balance: -1500
    });
    await customerService.create({
        name: 'Ayşe Demir',
        type: customer_entity_1.CustomerType.INDIVIDUAL,
        city: 'Ankara',
        phone: '0532 444 55 66',
        balance: -500
    });
    await customerService.create({
        name: 'Yılmaz Halı A.Ş.',
        type: customer_entity_1.CustomerType.CORPORATE,
        contactPerson: 'Mehmet Yılmaz',
        city: 'Bursa',
        taxOffice: 'Çekirge',
        taxNumber: '1234567890',
        balance: -125000
    });
    console.log('Customers seeded.');
    console.log('Seeding Products...');
    await productService.create({
        name: 'Merinos Klasik Halı',
        sku: 'MRN-001',
        brand: 'Merinos',
        stock: 50,
        price: 3500,
        category: 'Halı',
        criticalLevel: 10
    });
    await productService.create({
        name: 'Padişah Yolluk',
        sku: 'PD-202',
        brand: 'Padişah',
        stock: 120,
        price: 850,
        category: 'Yolluk',
        criticalLevel: 20
    });
    await productService.create({
        name: 'Brillant Tül Perde',
        sku: 'BR-303',
        brand: 'Brillant',
        stock: 200,
        price: 450,
        category: 'Perde',
        criticalLevel: 30
    });
    console.log('Products seeded.');
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed.js.map