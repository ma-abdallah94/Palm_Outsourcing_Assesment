import { APIRequestContext, expect } from '@playwright/test';

type NewCustomer = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
};

type Product = {
    id: string;
    name: string;
    price: number;
};

export class ToolshopApi {
    private readonly apiUrl: string;
    private token = '';

    constructor(private readonly request: APIRequestContext) {
        this.apiUrl = process.env.API_URL as string;
    }

    async login(email: string, password: string) {
        const response = await this.request.post(`${this.apiUrl}/users/login`, {
            data: { email, password },
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.access_token).toEqual(expect.any(String));
        this.token = body.access_token;
    }

    async expectProductList() {
        const products = await this.fetchProducts();
        expect(products.length).toBeGreaterThan(0);
        expect(products[0]).toEqual(expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
        }));
    }

    async registerCustomer(customer: NewCustomer) {
        const response = await this.request.post(`${this.apiUrl}/users/register`, {
            data: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                email: customer.email,
                password: customer.password,
                dob: customer.dob,
                phone: customer.phone,
                address: {
                    street: customer.street,
                    city: customer.city,
                    state: customer.state,
                    country: customer.country,
                    postal_code: customer.postalCode,
                },
            },
        });
        expect(response.status()).toBe(201);
    }

    async addFirstProductToFavorites() {
        const products = await this.fetchProducts();
        expect(products.length).toBeGreaterThan(0);

        const product = products[0];
        const response = await this.request.post(`${this.apiUrl}/favorites`, {
            headers: { Authorization: `Bearer ${this.token}` },
            data: { product_id: product.id },
        });
        expect(response.status()).toBe(201);
        return product.name;
    }

    private async fetchProducts(): Promise<Product[]> {
        const response = await this.request.get(`${this.apiUrl}/products`, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        return body.data;
    }
}
