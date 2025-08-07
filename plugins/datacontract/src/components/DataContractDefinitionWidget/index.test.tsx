import { render, screen } from "@testing-library/react";
import { DataContractDefinitionWidget } from "./index";

describe("DataContractDefinitionWidget", () => {
	const sampleYaml = `
dataContractSpecification: 0.9.2
id: urn:datacontract:checkout:orders-latest
info:
  title: Orders Latest
  version: 1.0.0
  description: Successful customer orders in the webshop
  owner: checkout-team
models:
  orders:
    type: table
    description: Order data
    fields:
      order_id:
        type: string
        description: Primary key
        required: true
        primary: true
        example: "O-123456"
`;

	it("should render HTML content instead of YAML code", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} />);

		// Should render HTML content, not YAML
		expect(screen.getByText("Data Contract")).toBeInTheDocument();
		expect(screen.getByText("Orders Latest")).toBeInTheDocument();
		expect(screen.getByText("1.0.0")).toBeInTheDocument();
		expect(screen.getByText("checkout-team")).toBeInTheDocument();

		// Should not render raw YAML
		expect(
			screen.queryByText("dataContractSpecification: 0.9.2"),
		).not.toBeInTheDocument();
	});

	it("should render field information in tables", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} />);

		// Check for model and field rendering
		expect(screen.getByText("orders")).toBeInTheDocument();
		expect(screen.getByText("Order data")).toBeInTheDocument();
		expect(screen.getByText("order_id")).toBeInTheDocument();
		expect(screen.getByText("Primary key")).toBeInTheDocument();
		expect(screen.getByText("primary")).toBeInTheDocument();
		expect(screen.getByText("required")).toBeInTheDocument();
	});

	it("should handle invalid YAML gracefully", () => {
		const invalidYaml = "invalid: yaml: content: [";
		render(<DataContractDefinitionWidget definition={invalidYaml} />);

		// Should show error message
		expect(screen.getByText(/Error parsing DataContract/)).toBeInTheDocument();
	});

	it("should escape HTML in content", () => {
		const yamlWithHtml = `
info:
  title: "<script>alert('xss')</script>"
  description: "This & that"
`;
		render(<DataContractDefinitionWidget definition={yamlWithHtml} />);

		// Should not execute scripts - the actual script tag should not be present
		const scripts = document.querySelectorAll("script");
		const hasXssScript = Array.from(scripts).some((script) =>
			script.textContent?.includes("alert('xss')"),
		);
		expect(hasXssScript).toBe(false);

		// Should contain properly escaped content
		const container = document.body;
		expect(container.innerHTML).toContain("&lt;script&gt;");
		expect(container.innerHTML).toContain("&amp;");
	});
});
