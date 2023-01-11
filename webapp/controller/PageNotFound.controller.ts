/**
 * @namespace com.myorg.myapp.controller
 */

import BaseController from './BaseController';

export default class PageNotFound extends BaseController {
	public onInit(): void {
		console.log('TEST');
	}
	public onNavBackHome(): void {
		console.log('test!!');
		this.getRouter().navTo('main', {});
	}
}
