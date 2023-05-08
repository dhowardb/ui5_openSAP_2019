import JSONModel from 'sap/ui/model/json/JSONModel';
import UI5Event from 'sap/ui/base/Event';
import BaseController from './BaseController';
import Model from 'sap/ui/model/Model';

interface IMessagePopOverMessageTemplate {
	type: string;
	title: string;
	active: boolean;
	description: string;
	subtitle?: string;
	counter: number;
}
interface IMessagePopOver {
	messages: IMessagePopOverMessageTemplate[];
	setODataModel(model: Model): void;
	setMessages(
		messages: {
			type: string;
			title: string;
			active: boolean;
			description: string;
			subtitle?: string;
			counter: number;
		}[]
	): void;
	// buttonIconFormatter(): any;
	popOverHandler(event: UI5Event): void;
}

export default class messagePopOver
	extends BaseController
	implements IMessagePopOver
{
	// buttonIconFormatter() {
	// 	return 'Neutral';
	// }

	private messageModel: Model;

	setODataModel(model: Model): void {
		this.messageModel = model;
	}

	messages: IMessagePopOverMessageTemplate[];

	setMessages(
		messages: {
			type: string;
			title: string;
			active: boolean;
			description: string;
			subtitle?: string;
			counter: number;
		}[]
	): void {
		this.messages = messages;
	}

	// buttonIconFormatter() {
	// 	console.log('instance formatter!!');
	// 	return '"sap-icon://error"';
	// }

	// static buttonIconFormatter() {
	// 	console.log('static formatter!!');
	// 	return '"sap-icon://error"';
	// }

	popOverHandler(event: UI5Event): void {
		if (!this.messages) {
			this.mockMessages();
		}
		this.setMessageOData();
	}

	private setMessageOData() {
		(this.messageModel as JSONModel).setData(this.messages);
	}

	private mockMessages() {
		this.messages = [
			{
				type: 'Error',
				title: 'Error message',
				active: true,
				description: 'Test Description',
				subtitle: 'Example of subtitle',
				counter: 1,
			},
			{
				type: 'Warning',
				title: 'Warning without description',
				active: false,
				description: '',
				subtitle: '',
				counter: 1,
			},
			{
				type: 'Success',
				title: 'Success message',
				active: false,
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1,
			},
			{
				type: 'Error',
				title: 'Error message',
				active: false,
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2,
			},
			{
				type: 'Information',
				title: 'Information message',
				active: false,
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1,
			},
		];
	}
}

export function buttonIconFormatter(): string {
	return 'sap-icon://information';
}

export const buttonTypeFormatter = (model: Model): string => {
	// Function body here
	// const messageModel = this.getModel('validationMessage');
	// console.log(messageModel);
	console.log(model);
	console.log(this);

	return 'Negative';
};
// export function buttonTypeFormatter(): string {
// 	const messageModel = this.getModel('validationMessage');

// 	console.log(messageModel);
// 	console.log(this);
// 	return 'Neutral';
// 	// const messages = this.getModel().oData;

// 	// 		aMessages.forEach(function (sMessage) {
// 	// 			switch (sMessage.type) {
// 	// 				case "Error":
// 	// 					sHighestSeverity = "Negative";
// 	// 					break;
// 	// 				case "Warning":
// 	// 					sHighestSeverity = sHighestSeverity !== "Negative" ? "Critical" : sHighestSeverity;
// 	// 					break;
// 	// 				case "Success":
// 	// 					sHighestSeverity = sHighestSeverity !== "Negative" && sHighestSeverity !== "Critical" ?  "Success" : sHighestSeverity;
// 	// 					break;
// 	// 				default:
// 	// 					sHighestSeverity = !sHighestSeverity ? "Neutral" : sHighestSeverity;
// 	// 					break;
// 	// 			}
// 	// 		});

// 	// 		return sHighestSeverity;
// }

export function highestSeverityMessages(): string {
	return 'Warning';
}
