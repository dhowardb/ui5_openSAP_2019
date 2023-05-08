import Controller from 'sap/ui/core/mvc/Controller';
import BaseController from '../controller/BaseController';
import firstCustomControl from './firstCustomControl';

export default class firstCustomView extends Controller {
	onInit(): void {
		const customControl = new firstCustomControl();
		this.byId('newView');
	}
}
