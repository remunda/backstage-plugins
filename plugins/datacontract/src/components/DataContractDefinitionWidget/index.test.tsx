import { render, screen } from "@testing-library/react";
import type { ApiEntity } from "@backstage/catalog-model";
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

	const mockApiEntity: ApiEntity = {
		apiVersion: "backstage.io/v1alpha1",
		kind: "API",
		metadata: { name: "test-api" },
		spec: { 
			type: "datacontract", 
			lifecycle: "production",
			owner: "team-a",
			definition: sampleYaml 
		},
	};

	it("renders main HTML structure", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} apiEntity={mockApiEntity} />);

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

	it("displays validation errors when present in entity annotations", () => {
		const entityWithErrors: ApiEntity = {
			...mockApiEntity,
			metadata: {
				...mockApiEntity.metadata,
				annotations: {
					'datacontract.io/validation-errors': 'Test validation error message'
				}
			}
		};

		render(<DataContractDefinitionWidget definition={sampleYaml} apiEntity={entityWithErrors} />);
		
		expect(screen.getByText("Data Contract Validation Issues:")).toBeInTheDocument();
		expect(screen.getByText("Test validation error message")).toBeInTheDocument();
	});

	it("does not display validation errors when not present", () => {
		render(<DataContractDefinitionWidget definition={sampleYaml} apiEntity={mockApiEntity} />);
		
		expect(screen.queryByText("Data Contract Validation Issues:")).not.toBeInTheDocument();
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
