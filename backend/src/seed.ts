import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomersService } from './customers/customers.service';
import { ProductsService } from './products/products.service';
import { CustomerType } from './customers/customer.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const customerService = app.get(CustomersService);
    const productService = app.get(ProductsService);

    console.log('Seeding Customers...');

    await customerService.create({
        name: 'Ahmet Yılmaz',
        type: CustomerType.INDIVIDUAL,
        city: 'İstanbul',
        phone: '0555 111 22 33',
        balance: -1500
    });

    await customerService.create({
        name: 'Ayşe Demir',
        type: CustomerType.INDIVIDUAL,
        city: 'Ankara',
        phone: '0532 444 55 66',
        balance: -500
    });

    await customerService.create({
        name: 'Yılmaz Halı A.Ş.',
        type: CustomerType.CORPORATE,
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
