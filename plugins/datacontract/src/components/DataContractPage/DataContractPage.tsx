import {
	Content,
	Header,
	HeaderLabel,
	InfoCard,
	Page,
	Table,
} from "@backstage/core-components";
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import { Alert, AlertTitle } from "@material-ui/lab";
import * as yaml from "js-yaml";
import type React from "react";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
	card: {
		marginBottom: theme.spacing(2),
	},
	section: {
		marginBottom: theme.spacing(3),
	},
	chip: {
		margin: theme.spacing(0.5),
	},
	fieldRow: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		padding: theme.spacing(1),
	},
	fieldName: {
		fontFamily: "monospace",
		fontWeight: "bold",
	},
	fieldType: {
		color: theme.palette.text.secondary,
		fontFamily: "monospace",
	},
	fieldDescription: {
		marginTop: theme.spacing(0.5),
	},
	dataModelTable: {
		"& .MuiTableCell-root": {
			padding: theme.spacing(1),
		},
	},
}));

interface DataContractPageProps {
	definition: string;
}

interface DataContractSpec {
	dataContractSpecification?: string;
	id?: string;
	info?: {
		title?: string;
		version?: string;
		description?: string;
		owner?: string;
		contact?: {
			name?: string;
			email?: string;
			url?: string;
		};
		status?: string;
	};
	tags?: string[];
	models?: Record<string, ModelSpec>;
	servers?: Record<string, ServerSpec>;
	terms?: {
		usage?: string;
		limitations?: string;
		billing?: string;
		noticePeriod?: string;
	};
	servicelevels?: Record<string, unknown>;
	definitions?: Record<string, unknown>;
	examples?: unknown[];
}

interface ModelSpec {
	type?: string;
	title?: string;
	description?: string;
	fields?: Record<string, FieldSpec>;
	primaryKey?: string;
	quality?: unknown[];
}

interface FieldSpec {
	type?: string;
	description?: string;
	required?: boolean;
	primary?: boolean;
	example?: string;
	classification?: string;
	pii?: boolean;
	format?: string;
	unique?: boolean;
}

interface ServerSpec {
	type?: string;
	location?: string;
	format?: string;
	delimiter?: string;
	[key: string]: unknown;
}

export const DataContractPage: React.FC<DataContractPageProps> = ({
	definition,
}) => {
	const classes = useStyles();

	let dataContract: DataContractSpec;
	try {
		dataContract = yaml.load(definition) as DataContractSpec;
	} catch (error) {
		return (
			<Page themeId="tool">
				<Header title="Data Contract">
					<HeaderLabel label="Error" value="Invalid YAML" />
				</Header>
				<Content>
					<Alert severity="error">
						<AlertTitle>YAML Parsing Error</AlertTitle>
						Failed to parse the data contract definition:{" "}
						{error instanceof Error ? error.message : "Unknown error"}
					</Alert>
				</Content>
			</Page>
		);
	}

	const renderInfoCard = () => (
		<InfoCard title="Information">
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle2" color="textSecondary">
						Title
					</Typography>
					<Typography variant="body1">
						{dataContract.info?.title || "N/A"}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle2" color="textSecondary">
						Version
					</Typography>
					<Typography variant="body1">
						{dataContract.info?.version || "N/A"}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle2" color="textSecondary">
						Status
					</Typography>
					<Typography variant="body1">
						{dataContract.info?.status || "N/A"}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle2" color="textSecondary">
						Owner
					</Typography>
					<Typography variant="body1">
						{dataContract.info?.owner || "N/A"}
					</Typography>
				</Grid>
				{dataContract.info?.description && (
					<Grid item xs={12}>
						<Typography variant="subtitle2" color="textSecondary">
							Description
						</Typography>
						<Typography variant="body1">
							{dataContract.info.description}
						</Typography>
					</Grid>
				)}
				{dataContract.info?.contact && (
					<Grid item xs={12}>
						<Typography variant="subtitle2" color="textSecondary">
							Contact
						</Typography>
						<Typography variant="body1">
							{dataContract.info.contact.name}
							{dataContract.info.contact.email && (
								<>
									{" - "}
									<a href={`mailto:${dataContract.info.contact.email}`}>
										{dataContract.info.contact.email}
									</a>
								</>
							)}
							{dataContract.info.contact.url && (
								<>
									{" - "}
									<a
										href={dataContract.info.contact.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{dataContract.info.contact.url}
									</a>
								</>
							)}
						</Typography>
					</Grid>
				)}
			</Grid>
		</InfoCard>
	);

	const renderServersCard = () => {
		if (
			!dataContract.servers ||
			Object.keys(dataContract.servers).length === 0
		) {
			return null;
		}

		return (
			<InfoCard title="Servers">
				{Object.entries(dataContract.servers).map(([serverName, server]) => (
					<Box key={serverName} className={classes.section}>
						<Typography variant="h6" gutterBottom>
							{serverName}
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Type
								</Typography>
								<Typography variant="body1">{server.type || "N/A"}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Format
								</Typography>
								<Typography variant="body1">
									{server.format || "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle2" color="textSecondary">
									Location
								</Typography>
								<Typography
									variant="body1"
									style={{ fontFamily: "monospace", wordBreak: "break-all" }}
								>
									{server.location || "N/A"}
								</Typography>
							</Grid>
						</Grid>
						<Divider style={{ margin: "16px 0" }} />
					</Box>
				))}
			</InfoCard>
		);
	};

	const renderTermsCard = () => {
		if (!dataContract.terms) {
			return null;
		}

		return (
			<InfoCard title="Terms and Conditions">
				<Grid container spacing={2}>
					{dataContract.terms.usage && (
						<Grid item xs={12}>
							<Typography variant="subtitle2" color="textSecondary">
								Usage
							</Typography>
							<Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
								{dataContract.terms.usage}
							</Typography>
						</Grid>
					)}
					{dataContract.terms.limitations && (
						<Grid item xs={12}>
							<Typography variant="subtitle2" color="textSecondary">
								Limitations
							</Typography>
							<Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
								{dataContract.terms.limitations}
							</Typography>
						</Grid>
					)}
					{dataContract.terms.billing && (
						<Grid item xs={12} sm={6}>
							<Typography variant="subtitle2" color="textSecondary">
								Billing
							</Typography>
							<Typography variant="body1">
								{dataContract.terms.billing}
							</Typography>
						</Grid>
					)}
					{dataContract.terms.noticePeriod && (
						<Grid item xs={12} sm={6}>
							<Typography variant="subtitle2" color="textSecondary">
								Notice Period
							</Typography>
							<Typography variant="body1">
								{dataContract.terms.noticePeriod}
							</Typography>
						</Grid>
					)}
				</Grid>
			</InfoCard>
		);
	};

	const renderDataModelsCard = () => {
		if (!dataContract.models || Object.keys(dataContract.models).length === 0) {
			return null;
		}

		return (
			<InfoCard title="Data Models">
				{Object.entries(dataContract.models).map(([modelName, model]) => (
					<Box key={modelName} className={classes.section}>
						<Box display="flex" alignItems="center" marginBottom={2}>
							<Typography variant="h6" style={{ fontFamily: "monospace" }}>
								{model.title || modelName}
							</Typography>
							{model.title !== modelName && (
								<Typography
									variant="body2"
									color="textSecondary"
									style={{ marginLeft: 8 }}
								>
									({modelName})
								</Typography>
							)}
							<Chip
								label={model.type || "table"}
								size="small"
								color="primary"
								variant="outlined"
								className={classes.chip}
							/>
						</Box>
						{model.description && (
							<Typography variant="body2" color="textSecondary" gutterBottom>
								{model.description}
							</Typography>
						)}

						{model.fields && (
							<Table
								options={{
									paging: false,
									search: false,
									toolbar: false,
									headerStyle: {
										backgroundColor: "#f5f5f5",
										fontWeight: "bold",
									},
								}}
								data={Object.entries(model.fields).map(
									([fieldName, field]) => ({
										name: fieldName,
										type: field.type || "string",
										description: field.description || "",
										constraints: [
											...(field.required ? ["required"] : []),
											...(field.primary ? ["primary"] : []),
											...(field.unique ? ["unique"] : []),
											...(field.format ? [`format:${field.format}`] : []),
											...(field.classification ? [field.classification] : []),
											...(field.pii ? ["PII"] : []),
										],
										example: field.example || "",
									}),
								)}
								columns={[
									{
										title: "Field Name",
										field: "name",
										render: (rowData) => (
											<Typography variant="body2" className={classes.fieldName}>
												{(rowData as { name: string }).name}
											</Typography>
										),
									},
									{
										title: "Type",
										field: "type",
										render: (rowData) => (
											<Typography variant="body2" className={classes.fieldType}>
												{(rowData as { type: string }).type}
											</Typography>
										),
									},
									{
										title: "Description & Constraints",
										field: "description",
										render: (rowData) => {
											const data = rowData as {
												description: string;
												example: string;
												constraints: string[];
											};
											return (
												<Box>
													<Typography variant="body2">
														{data.description}
													</Typography>
													{data.example && (
														<Typography variant="caption" color="textSecondary">
															Example: {data.example}
														</Typography>
													)}
													<Box marginTop={0.5}>
														{data.constraints.map((constraint: string) => (
															<Chip
																key={constraint}
																label={constraint}
																size="small"
																color={
																	constraint === "PII"
																		? "secondary"
																		: constraint === "primary"
																			? "primary"
																			: constraint === "required"
																				? "default"
																				: "default"
																}
																variant="outlined"
																className={classes.chip}
															/>
														))}
													</Box>
												</Box>
											);
										},
									},
								]}
							/>
						)}
						{model.primaryKey && (
							<Box marginTop={2}>
								<Typography variant="subtitle2" color="textSecondary">
									Primary Key:{" "}
									<span style={{ fontFamily: "monospace" }}>
										{model.primaryKey}
									</span>
								</Typography>
							</Box>
						)}
						<Divider style={{ margin: "16px 0" }} />
					</Box>
				))}
			</InfoCard>
		);
	};

	return (
		<Page themeId="tool">
			<Header title="Data Contract">
				<HeaderLabel label="ID" value={dataContract.id || "N/A"} />
				{dataContract.dataContractSpecification && (
					<HeaderLabel
						label="Specification"
						value={`v${dataContract.dataContractSpecification}`}
					/>
				)}
			</Header>
			<Content>
				<Grid container spacing={3}>
					{/* Tags Section */}
					{dataContract.tags && dataContract.tags.length > 0 && (
						<Grid item xs={12}>
							<Box
								display="flex"
								alignItems="center"
								style={{ gap: 8 }}
								marginBottom={2}
							>
								<Typography variant="h6">Tags:</Typography>
								{dataContract.tags.map((tag) => (
									<Chip
										key={tag}
										label={tag}
										color="primary"
										variant="outlined"
										size="small"
									/>
								))}
							</Box>
						</Grid>
					)}

					{/* Show YAML Button */}
					<Grid item xs={12}>
						<Box display="flex" justifyContent="flex-end" marginBottom={2}>
							<Button
								variant="outlined"
								startIcon={<DescriptionIcon />}
								onClick={() => {
									// Create a modal or expandable section to show YAML
									const yamlWindow = window.open("", "_blank");
									if (yamlWindow) {
										yamlWindow.document.write(`
                      <html>
                        <head><title>Data Contract YAML</title></head>
                        <body>
                          <pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">
${definition}
                          </pre>
                        </body>
                      </html>
                    `);
									}
								}}
							>
								Show YAML
							</Button>
						</Box>
					</Grid>

					{/* Information Card */}
					<Grid item xs={12} md={6}>
						{renderInfoCard()}
					</Grid>

					{/* Servers Card */}
					{dataContract.servers && (
						<Grid item xs={12} md={6}>
							{renderServersCard()}
						</Grid>
					)}

					{/* Terms Card */}
					{dataContract.terms && (
						<Grid item xs={12}>
							{renderTermsCard()}
						</Grid>
					)}

					{/* Data Models Card */}
					<Grid item xs={12}>
						{renderDataModelsCard()}
					</Grid>

					{/* Footer */}
					<Grid item xs={12}>
						<Typography variant="caption" color="textSecondary">
							Created with{" "}
							<a
								href="https://editor.datacontract.com"
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: "inherit" }}
							>
								Data Contract Editor
							</a>
						</Typography>
					</Grid>
				</Grid>
			</Content>
		</Page>
	);
};
