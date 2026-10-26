import { APIRequestContext, expect } from '@playwright/test';
import { Fluent } from '../fluent';

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

export class ToolshopApi extends Fluent {
    private readonly apiUrl: string;
    private token = '';

    constructor(private readonly request: APIRequestContext) {
        super();
        this.apiUrl = process.env.API_URL as string;
    }

    login(email: string, password: string): this {
        return this.step(async () => {
            const response = await this.request.post(`${this.apiUrl}/users/login`, {
                data: { email, password },
            });
            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.access_token).toEqual(expect.any(String));
            this.token = body.access_token;
        });
    }

    expectProductList(): this {
        return this.step(async () => {
            const products = await this.fetchProducts();
            expect(products.length).toBeGreaterThan(0);
            expect(products[0]).toEqual(expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
            }));
        });
    }

    registerCustomer(customer: NewCustomer): this {
        return this.step(async () => {
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
        });
    }

    async addFirstProductToFavorites(): Promise<string> {
        await this;
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
