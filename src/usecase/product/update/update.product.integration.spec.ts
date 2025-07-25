import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    // Create a product to be updated
    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product 1 Updated",
      price: 150,
    };

    const output = {
      id: "123",
      name: "Product 1 Updated",
      price: 150,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);

    // Verify that the product was actually updated in the repository
    const updatedProduct = await productRepository.find("123");
    expect(updatedProduct.name).toBe("Product 1 Updated");
    expect(updatedProduct.price).toBe(150);
  });

  it("should throw an error when product is not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "456", // Non-existent ID
      name: "Product Not Found",
      price: 200,
    };

    await expect(usecase.execute(input)).rejects.toThrow();
  });
});