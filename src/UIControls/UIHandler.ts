import JSONModel from 'sap/ui/model/json/JSONModel';
import BaseController from '../controller/BaseController';

interface UIHandlerInterface {
	screenHandler(id: string, layout: string, nextRoute: string): void;
}

export default class UIHandler
	extends BaseController
	implements UIHandlerInterface
{
	constructor() {
		super('');
	}

	public screenHandler(id: string, layout: string, nextRoute: string): void {
		const appView = 'appView' as string;

		const nextLayout = (super.getModel(appView) as JSONModel).getProperty(
			layout
		) as string;

		super.getRouter().navTo(nextRoute, { layout: nextLayout, id: id });
	}
}
