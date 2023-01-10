import Log from 'sap/base/Log';
import BaseController from './BaseController';

/**
 * @namespace com.myorg.myapp.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(
			this.getOwnerComponent().getContentDensityClass()
		);
		Log.info('Controller has been initialized!');
	}

	public onBeforeRendering(): void {
		Log.info('The view will be shortly rendered!');
	}

	public onAfterRendering(): void {
		Log.info('The view has been rendered!');
	}
	public onExit(): void {
		Log.info('Controller will be shortly destroyed!');
	}
}
