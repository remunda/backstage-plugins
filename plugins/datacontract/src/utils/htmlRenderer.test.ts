import { parseDataContract, renderDataContractHtml } from "./htmlRenderer";

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

	describe("parseDataContract", () => {
		it("should parse valid YAML", () => {
			const result = parseDataContract(sampleYaml);
			expect(result.id).toBe("urn:datacontract:checkout:orders-latest");
			expect(result.info?.title).toBe("Orders Latest");
			expect(result.models?.orders?.fields?.order_id?.type).toBe("string");
		});

		it("should throw error for invalid YAML", () => {
			const invalidYaml = "invalid: yaml: content: [";
			expect(() => parseDataContract(invalidYaml)).toThrow();
		});
	});

	describe("renderDataContractHtml", () => {
		it("should render HTML for valid YAML", () => {
			const html = renderDataContractHtml(sampleYaml);

			// Check for key elements
			expect(html).toContain("Data Contract");
			expect(html).toContain("Orders Latest");
			expect(html).toContain("1.0.0");
			expect(html).toContain("John Doe");
			expect(html).toContain("order_id");
			expect(html).toContain("Primary key of the orders table");
			expect(html).toContain("required");
			expect(html).toContain("primary");
		});

		it("should render error message for invalid YAML", () => {
			const invalidYaml = "invalid: yaml: content: [";
			const html = renderDataContractHtml(invalidYaml);

			expect(html).toContain("Error parsing DataContract");
		});

		it("should escape HTML in content", () => {
			const yamlWithHtml = `
info:
  title: "<script>alert('xss')</script>"
  description: "This & that <b>bold</b>"
models:
  test:
    fields:
      field1:
        description: "<img src=x onerror=alert(1)>"
`;
			const html = renderDataContractHtml(yamlWithHtml);

			// Should not contain actual script tags
			expect(html).not.toContain("<script>");
			expect(html).not.toContain("<img src=x");
			// Should contain escaped content
			expect(html).toContain("&lt;script&gt;");
			expect(html).toContain("&amp;");
		});
	});
});
