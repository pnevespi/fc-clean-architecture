import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Test create product use case", () => {
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      price: 100,
    };

    const result = await usecase.execute(input);

    expect(result).toHaveProperty("id");
    expect(result.name).toBe(input.name);
    expect(result.price).toBe(input.price);

    // Verify that the product was actually saved to the repository
    const savedProduct = await productRepository.find(result.id);
    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct.id).toBe(result.id);
    expect(savedProduct.name).toBe(input.name);
    expect(savedProduct.price).toBe(input.price);
  });
});