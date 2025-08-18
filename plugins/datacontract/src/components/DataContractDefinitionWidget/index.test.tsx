import { render } from "@testing-library/react";
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

	it("renders iframe container", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} />);

		// Should render the iframe container
		const iframe = document.querySelector("iframe");
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute("title", "Data Contract Display");

		// Check that iframe src contains the expected content
		expect(iframe?.src).toMatch(/^data:text\/html/);
	});

	// it("handles invalid YAML gracefully", () => {
	// 	const invalidYaml = "invalid: yaml: content: [";

	// 	// The component should render without throwing
	// 	// Invalid YAML errors are handled within the iframe
	// 	expect(() => {
	// 		render(<DataContractDefinitionWidget definition={invalidYaml} />);
	// 	}).not.toThrow();

	// 	// Should still render the iframe container
	// 	expect(document.querySelector('iframe')).toBeInTheDocument();
	// });
});
