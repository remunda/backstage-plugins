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

		// Basic layout present
		expect(screen.getByText("Data Contract")).toBeInTheDocument();
		expect(screen.getByText("Data Model")).toBeInTheDocument();

		// Should not render raw YAML
		expect(
			screen.queryByText("dataContractSpecification: 0.9.2"),
		).not.toBeInTheDocument();
	});

	it("throws on invalid YAML", () => {
		const invalidYaml = "invalid: yaml: content: [";
		expect(() =>
			render(<DataContractDefinitionWidget definition={invalidYaml} />),
		).toThrow();
	});
});
