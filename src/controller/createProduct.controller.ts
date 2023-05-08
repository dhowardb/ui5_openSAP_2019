import BaseController from './BaseController';
import UI5Event from 'sap/ui/base/Event';
import Form from 'sap/ui/layout/form/Form';
import Input from 'sap/m/Input';
import DatePicker from 'sap/m/DatePicker';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ComboBox from 'sap/m/ComboBox';
import ListItem from 'sap/ui/core/ListItem';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
import Control from 'sap/ui/core/Control';
import MessageToast from 'sap/m/MessageToast';
import Button from 'sap/m/Button';
import Label from 'sap/m/Label';
import messagePopOver, {
	buttonIconFormatter,
	buttonTypeFormatter,
	highestSeverityMessages,
} from './messagePopOver';
import Core from 'sap/ui/core/Core';
// import axios from 'axios';
declare let axios: any;

interface formElementNames {
	input: string;
	date: string;
	combobox: string;
}

interface Rating {
	ID: number;
	Rating: number;
}

interface Product {
	ID: number;
}

interface ProductID {
	ID: string;
}

interface ProductsModel {
	results: ProductID[];
}

type ButtonTypeFormatter = () => string;
export default class createProduct extends BaseController {
	// implements formElementNames
	// input: string;
	// date: string;

	//formatters
	// private buttonIconFormatter = buttonIconFormatter;
	// private buttonTypeFormatter: ButtonTypeFormatter;
	// private highestSeverityMessages = highestSeverityMessages;

	formInputElements: formElementNames = {
		date: 'sap.m.DatePicker',
		input: 'sap.m.Input',
		combobox: 'sap.m.ComboBox',
	};

	public onInit(): void {
		this.getRouter()
			.getRoute('createProduct')
			.attachPatternMatched(
				(event: UI5Event) => this.onObjectMatched(event),
				this
			);

		(this.byId('createProductReleasedDate') as DatePicker).setMaxDate(
			new Date()
		);

		this.setModel(this.getRatingModel(), 'rating');
		this.setModel(
			new JSONModel({
				submitStatus: false,
			}),
			'submitEnabled'
		);
	}

	public onAfterRendering(): void {
		this.setStateForInitialValues('createProductForm');
	}

	public onChangeProductRating(event: UI5Event): void {
		const source = event.getSource() as Input;

		const value = source.getValue();

		const ratingModel = this.getModel('rating');
		const ratingObjects = ratingModel.getObject('/data') as Rating[];

		const ratingArray = [];
		for (const ratingObject of ratingObjects) {
			ratingArray.push(ratingObject.Rating);
		}

		if (ratingArray.some((rating) => rating.toString() === value)) {
			source.setValueState('None');
			const submitEnabledModel = this.getModel('submitEnabled') as ODataModel;
			// submitEnabledModel.setProperty('/submitStatus', true);
			this.updateCreateButtonState('createProductForm', 'createProductButton');
		} else {
			source.setValueState('Error');

			const resourceBundle = this.getResourceBundle();
			const errorText = resourceBundle.getText('errorProductRating');
			source.setValueStateText(errorText);

			const submitEnabledModel = this.getModel('submitEnabled') as ODataModel;
			submitEnabledModel.setProperty('/submitStatus', false);
		}

		// if (parseInt(value) > 5) {
		// 	source.setValueState('Error');

		// 	const resourceBundle = this.getResourceBundle();
		// 	const errorText = resourceBundle.getText('errorProductRating');
		// 	source.setValueStateText(errorText);
		// } else {
		// 	source.setValueState('None');
		// }
	}

	public onChangeDate(event: UI5Event): void {
		const source = event.getSource() as DatePicker;
		const dateSelected = source.getValue().toString();

		let dateToday = new Date().toLocaleDateString();

		const dateRemoveYear = dateToday.substring(0, dateToday.length - 4);
		const getLastTwoDigitsofYear = dateToday.slice(-2);

		dateToday = dateRemoveYear + getLastTwoDigitsofYear;

		if (dateToday < dateSelected) {
			source.setValueState('Error');

			source.setValueStateText(
				this.getResourceBundle().getText('errorDateSelected')
			);
			this.updateCreateButtonState('createProductForm', 'createProductButton');
		} else {
			source.setValueState('None');
			this.updateCreateButtonState('createProductForm', 'createProductButton');
		}
	}

	public onLoadItemsHandler(event: UI5Event): void {
		const comboBox = this.byId('createComboBoxRating') as ComboBox;
		const ratingModel = this.getModel('rating');
		const ratingObjects = ratingModel.getObject('/data') as Rating[];
		ratingObjects.forEach((ratingObject) => {
			const listItem = new ListItem({
				key: ratingObject.ID.toString(),
				text: ratingObject.Rating.toString(),
			});
			comboBox.addItem(listItem);
		});
	}

	public onChangePriceHandler(event: UI5Event): void {
		const source = event.getSource() as Input;
		const value = source.getValue();
		if (value && parseInt(value) > 0) {
			source.setValueState('None');
			this.updateCreateButtonState('createProductForm', 'createProductButton');
			return;
		}
		source.setValueState('Error');
		source.setValueStateText('Invalid Price should be greater than 0'); //add to i18n
		this.updateCreateButtonState('createProductForm', 'createProductButton');
	}

	public onChangeProductID(event: UI5Event): void {
		const source = event.getSource() as Input;
		const value = source.getValue();

		const productIDModel = this.getModel() as ODataModel;

		productIDModel.read('/Products', {
			urlParameters: {
				$select: 'ID',
			},
			success: (data: ProductsModel) => {
				if (this.isIDExist(data, value)) {
					source.setValueState('Error');
					const resourceBundle = this.getResourceBundle();
					const errorText = resourceBundle.getText('errorProductIDExists');
					source.setValueStateText(errorText);
					this.updateCreateButtonState(
						'createProductForm',
						'createProductButton'
					);
				} else {
					productIDModel.read('/Products', {
						urlParameters: {
							$select: 'ID',
							$orderby: 'ID desc',
							$top: '1',
						},

						success: (data: ProductsModel) => {
							for (const result of data.results) {
								const nextID = parseInt(result.ID) + 1;

								if (nextID === parseInt(value)) {
									source.setValueState('None');
									source.setValueStateText('New ID is valid!');
									this.updateCreateButtonState(
										'createProductForm',
										'createProductButton'
									);
								} else {
									source.setValueState('Error');
									const resourceBundle = this.getResourceBundle();
									const errorText = resourceBundle.getText(
										'errorProductIDNotValid',
										[nextID.toString()]
									);
									source.setValueStateText(errorText);
									this.updateCreateButtonState(
										'createProductForm',
										'createProductButton'
									);
								}
							}
						},
					});
				}
			},
		});

		// const productIDObject = productIDModel.getObject('/Products(0)') as [];
	}

	public messagePopoverPressHandler(event: UI5Event) {
		MessageToast.show('Popover was clicked!');
		const messageHandler = new messagePopOver('');

		const messageModel = new JSONModel();
		this.setModel(messageModel, 'validationMessage');

		messageHandler.setODataModel(this.getModel('validationMessage'));
		messageHandler.popOverHandler(event);

		const message = this.getModel('validationMessage');
		const test3 = this.getModel('validationMessage') as JSONModel;
		console.log(test3.getData());
	}

	private buttonIconFormatter(): string {
		return 'sap-icon://information';
	}

	private buttonTypeFormatter = (): string => {
		let highestSeverity: string;

		const messageModel = this.getModel('validationMessage');

		if (messageModel) {
			console.log('Model was set!');
			return 'Neutral';
		}

		// messageModel.attachRequestCompleted(() => {
		// 	console.log('Completed!');
		// 	// const messages = (
		// 	// 	this.getModel('validationMessage') as JSONModel
		// 	// ).getData() as [];

		// 	// messages.forEach((message) => {
		// 	// 	console.log(message);
		// 	// });

		// 	// for (const message in messages) {
		// 	// 	console.log(message);
		// 	// }
		// });

		// const aMessages = this.getView().getModel(
		// 	'validationMessage'
		// ) as JSONModel[];
		// aMessages.forEach(function (sMessage) {
		// 	switch (sMessage.type) {
		// 		case 'Error':
		// 			highestSeverity = 'Negative';
		// 			break;
		// 		case 'Warning':
		// 			highestSeverity =
		// 				highestSeverity !== 'Negative' ? 'Critical' : highestSeverity;
		// 			break;
		// 		case 'Success':
		// 			highestSeverity =
		// 				highestSeverity !== 'Negative' && highestSeverity !== 'Critical'
		// 					? 'Success'
		// 					: highestSeverity;
		// 			break;
		// 		default:
		// 			highestSeverity = !highestSeverity ? 'Neutral' : highestSeverity;
		// 			break;
		// 	}
		// });

		// return highestSeverity;
		return 'Negative';
	};

	private highestSeverityMessages(): string {
		return 'Warning';
	}

	public async onCreateProductHandler(event: UI5Event): Promise<void> {
		const popOverButton = this.byId('messagePopoverButton') as Button;
		popOverButton.setVisible(true);

		const form = this.byId('createProductForm') as Form;

		const postDataToODataAxios = async (formData: FormData) => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const response = await axios.post(
					'https://services.odata.org/V2/Northwind/Northwind.svc/Products',
					formData
				);
				console.log(response);
				MessageToast.show('Product was created successfully!');
			} catch (error) {
				console.error(error);
				MessageToast.show('Request Failed!');
			}
		};

		const formData = new FormData();

		const formElements = form.getFormContainers()[0].getFormElements();

		for (const formElement of formElements) {
			const fields = formElement.getFields();
			const inputFields = this.getInputFields(fields);
			for (const inputField of inputFields) {
				const value = inputField.getValue();
				const id = inputField.getId();
				const formDataID = this.getIDforForm(id);
				if (formDataID === 'ReleasedDate') {
					//do nothing
					console.log('Not appending ReleasedDate');
				} else {
					formData.append(formDataID, value);
				}
			}
		}

		formData.forEach((value, key) => {
			console.log(key, value);
		});

		const data: Record<string, any> = {};
		for (const [key, value] of formData.entries()) {
			if (key === 'ReleasedDate') {
				// const releasedDateValue = new Date(value as string);

				const dateParts = (value as string).split('/');
				dateParts[2] = '20' + dateParts[2];
				const dateValue = new Date(
					parseInt(dateParts[2]),
					parseInt(dateParts[0]) - 1,
					parseInt(dateParts[1])
				);
				const releasedDate = dateValue.toISOString();
				const releasedDateFormatted = releasedDate.slice(0, 10) + 'T12:00:00';
				console.log(releasedDateFormatted);
				// data[key] = releasedDateFormatted;
			} else {
				data[key] = value;
			}
		}

		console.log(data);

		interface dataContainer {
			Description: string;
			ID: string;
			Price: string;
			Rating: number;
			ReleasedDate: string;
		}

		const postDataToOData = async (data: dataContainer): Promise<any> => {
			const model = this.getModel() as ODataModel;

			try {
				const result = await new Promise((resolve, reject) => {
					model.create('/Products', data, {
						success: (oData: any, response: any) => {
							resolve(oData);
						},
						error: (error: any) => {
							reject(error);
						},
					});
				});

				console.log('OData created successfully', result);
			} catch (error) {
				console.error('Error creating OData', error);
			}
		};

		await postDataToOData(data as dataContainer); //using odataCreate
		await postDataToODataAxios(formData); //posting using axios

		// $.ajax({
		// 	type: "POST",
		// 	url: "https://your-odata-service-endpoint",
		// 	data: formData,
		// 	contentType: false,
		// 	processData: false,
		// 	success: function(data) {
		// 	  console.log("Data successfully sent to OData service");
		// 	},
		// 	error: function(error) {
		// 	  console.error("Error sending data to OData service:", error);
		// 	}
		//   });
	}

	private getInputFields(fields: Control[]) {
		const inputFields = fields.filter((field) => {
			return (
				field.getMetadata().getName() === this.formInputElements.input ||
				field.getMetadata().getName() === this.formInputElements.date ||
				field.getMetadata().getName() === this.formInputElements.combobox
			);
		}) as Input[];

		return inputFields;
	}

	private onObjectMatched(event: UI5Event): void {
		// console.log(event);
	}

	private onBackCreateHandler(): void {
		this.getRouter().navTo('master');
	}

	private onCloseCreateHandler(): void {
		this.clearInputFields('createProductForm');
		this.getRouter().navTo('master');
	}

	private clearInputFields(id: string): void {
		const form = this.getView().byId(id) as Form;

		const formElements = form.getFormContainers()[0].getFormElements();

		//method 1
		// for (const formElement of formElements) {
		// 	const fields = formElement.getFields();
		// 	for (const field of fields) {
		// 		const fieldName = field.getMetadata().getName();
		// 		if (fieldName === this.formInputElements.input) {
		// 			const inputField = field as Input;
		// 			inputField.setValue('');
		// 		}
		// 		if (fieldName === this.formInputElements.date) {
		// 			const dateField = field as DatePicker;
		// 			dateField.setValue('');
		// 		}
		// 	}
		// }

		//method 2 (preferred)
		for (const formElement of formElements) {
			const fields = formElement.getFields();

			const inputFields = fields.filter((field) => {
				return (
					field.getMetadata().getName() === this.formInputElements.input ||
					field.getMetadata().getName() === this.formInputElements.date ||
					field.getMetadata().getName() === this.formInputElements.combobox
				);
			}) as Input[];

			for (const inputField of inputFields) {
				inputField.setValue('');
			}
		}
	}

	private getRatingModel(): JSONModel {
		const data: Rating[] = [];

		for (let index = 5; index >= 1; index = index - 0.5) {
			data.push({
				ID: index,
				Rating: index,
			});
		}
		const ratingObject = { data };
		return new JSONModel(ratingObject);
	}

	private isIDExist(data: ProductsModel, value: string): boolean {
		for (const result of data.results) {
			if (value === result.ID.toString()) {
				return true;
			}
		}
	}

	//ID or formData Properties should be same with OData or backend
	private getIDforForm(elementID: string): string {
		// const formDataStructure: { [key: string]: string } = {
		// 	'container-myapp---createProduct--createProductID': 'ID',
		// 	'container-myapp---createProduct--createProductName': 'Description',
		// 	'container-myapp---createProduct--createProductReleasedDate': 'ReleasedDate',
		// 	'container-myapp---createProduct--createComboBoxRating': 'Rating',
		// 	'container-myapp---createProduct--createProductPrice': 'Price',
		// };

		// return formDataStructure[elementID] || '';

		const stringID = 'container-myapp---createProduct--create';
		const formData = [
			['ProductID', 'ID'],
			['ProductName', 'Description'],
			['ProductReleasedDate', 'ReleasedDate'],
			['ComboBoxRating', 'Rating'],
			['ProductPrice', 'Price'],
		];

		const formDataStructure = formData.reduce((obj, [key, value]) => {
			obj[`${stringID}${key}`] = value;
			return obj;
		}, {} as { [key: string]: string });

		return formDataStructure[elementID] || '';
	}

	private updateCreateButtonState(formID: string, buttonID: string): void {
		const form = this.byId(formID) as Form;
		const button = this.byId(buttonID) as Button;
		const formElements = form.getFormContainers()[0].getFormElements();

		if (button.getEnabled() === true) {
			console.log(button.getEnabled(), 'Button is enabled');
		}
		for (const formElement of formElements) {
			const fields = formElement.getFields();
			const inputFields = this.getInputFields(fields);

			for (const inputField of inputFields) {
				const isRequired = this.getLabelStatus(inputField.getLabels());
				const inputState = inputField.getProperty('valueState') as string;
				const inputValue = inputField.getValue();
				if (isRequired === true && inputValue.length === 0) {
					button.setEnabled(false);
					return;
				}

				if (inputState === 'Error') {
					button.setEnabled(false);
					return;
				}
			}
		}
		button.setEnabled(true);
	}

	private getLabelStatus(labels: Label[]) {
		for (const label of labels) {
			return label.getProperty('required') as boolean;
		}
	}

	private setStateForInitialValues(formID: string): void {
		const form = this.byId(formID) as Form;
		const formElements = form.getFormContainers()[0].getFormElements();
		for (const formElement of formElements) {
			const fields = formElement.getFields();
			const inputFields = this.getInputFields(fields);
			for (const inputField of inputFields) {
				const inputValue = inputField.getValue();
				const inputMandatory = inputField.getProperty('required') as boolean;
				if (!inputValue.length && inputMandatory === true) {
					inputField.setValueState('Error');
					const errorText = this.getResourceBundle().getText(
						'errorInputsMandatory'
					);
					inputField.setValueStateText(errorText);
				}
			}
		}
	}
}
