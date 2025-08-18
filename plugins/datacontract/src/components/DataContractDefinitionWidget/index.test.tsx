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

	it("renders main HTML structure", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} />);

		// Check that an iframe is rendered (since the component renders HTML in an iframe)
		const iframe = screen.getByRole("presentation", { hidden: true });
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute(
			"sandbox",
			"allow-scripts allow-popups allow-popups-to-escape-sandbox",
		);

		// Should not render raw YAML in the main document
		expect(
			screen.queryByText("dataContractSpecification: 0.9.2"),
		).not.toBeInTheDocument();
	});

	it("throws on invalid YAML", () => {
		const invalidYaml = "invalid: yaml: content: [";
		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		expect(() =>
			render(<DataContractDefinitionWidget definition={invalidYaml} />),
		).toThrow();

		consoleSpy.mockRestore();
	});
});
