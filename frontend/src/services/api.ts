import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Backend URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const customersApi = {
    getAll: async () => {
        const response = await api.get('/customers');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/customers', data);
        return response.data;
    },
};

export const productsApi = {
    getAll: async (supplierId?: number) => {
        const params = supplierId ? { supplierId } : {};
        const response = await api.get('/products', { params });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/products', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.patch(`/products/${id}`, data);
        return response.data;
    },
};

export const salesApi = {
    getAll: async (page = 1, limit = 10, search = '', status = '') => {
        const params = { page, limit, search, status };
        const response = await api.get('/sales', { params });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/sales', data);
        return response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/sales/${id}/status`, { status });
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/sales/stats');
        return response.data;
    }
};

export const dashboardApi = {
    getOverview: async () => {
        const response = await api.get('/dashboard/overview');
        return response.data;
    }
};

export const purchasesApi = {
    getAll: async () => {
        const response = await api.get('/purchases');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/purchases', data);
        return response.data;
    },
    receive: async (id: string) => {
        const response = await api.patch(`/purchases/${id}/receive`);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/purchases/${id}/status`, { status });
        return response.data;
    }
};

export const suppliersApi = {
    getAll: async () => {
        const response = await api.get('/suppliers');
        return response.data;
    },
    getOne: async (id: number) => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/suppliers', data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    },
    addProduct: async (supplierId: number, productId: number) => {
        const response = await api.post(`/suppliers/${supplierId}/products/${productId}`);
        return response.data;
    },
    removeProduct: async (supplierId: number, productId: number) => {
        const response = await api.delete(`/suppliers/${supplierId}/products/${productId}`);
        return response.data;
    }
};

export default api;
