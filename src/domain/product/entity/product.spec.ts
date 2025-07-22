import Product from "./product";
import NotificationError from "../../@shared/notification/notification.error";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "Product 1", 100);
    }).toThrow(NotificationError);
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const product = new Product("123", "", 100);
    }).toThrow(NotificationError);
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      const product = new Product("123", "Name", -1);
    }).toThrow(NotificationError);
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should throw error when name is empty during name change", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changeName("");
    }).toThrow(NotificationError);
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });

  it("should throw error when price is less than zero during price change", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changePrice(-1);
    }).toThrow(NotificationError);
  });

  it("should accumulate multiple errors", () => {
    try {
      const product = new Product("", "", -1);
      fail("Product validation should throw a NotificationError");
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationError);
      const notificationError = error as NotificationError;
      expect(notificationError.errors.length).toBe(3);
      expect(notificationError.errors[0].context).toBe("product");
      expect(notificationError.errors[0].message).toBe("Id is required");
      expect(notificationError.errors[1].context).toBe("product");
      expect(notificationError.errors[1].message).toBe("Name is required");
      expect(notificationError.errors[2].context).toBe("product");
      expect(notificationError.errors[2].message).toBe("Price must be greater than or equal to zero");
    }
  });
});