import { renderDataContract } from "./htmlRenderer";

describe("htmlRenderer", () => {
	const sampleYaml = `
dataContractSpecification: 0.9.2
id: urn:datacontract:checkout:orders-latest
info:
  title: Orders Latest
  version: 1.0.0
  description: Successful customer orders in the webshop. All orders since 2020-01-01.
  owner: checkout
  contact:
    name: John Doe
    email: john.doe@example.com
models:
  orders:
    type: table
    description: Successful customer orders in the webshop.
    fields:
      order_id:
        type: string
        description: Primary key of the orders table
        required: true
        primary: true
        example: "O-123456"
      customer_id:
        type: string
        description: Unique identifier for the customer
        required: true
        example: "C-789012"
      order_total:
        type: number
        description: Total amount of the order
        required: true
        example: 99.99
      order_status:
        type: string
        description: Current status of the order
        required: true
        example: "delivered"
        classification: public
`;

	describe("renderDataContract", () => {
		it("renders HTML for valid YAML without throwing", () => {
			expect(() => renderDataContract(sampleYaml)).not.toThrow();
			const html = renderDataContract(sampleYaml);

			// Basic sanity checks for main layout
			expect(html).toContain("Data Contract");
			expect(html).toContain("Data Model");
		});

		it("throws error for invalid YAML", () => {
			const invalidYaml = "invalid: yaml: content: [";
			expect(() => renderDataContract(invalidYaml)).toThrow();
		});
	});
});
