import MessageBox from 'sap/m/MessageBox';
import BaseController from './BaseController';
import formatter from '../model/formatter';
import MessageToast from 'sap/m/MessageToast';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import ManagedObject from 'sap/ui/base/ManagedObject';
import JSONListBinding from 'sap/ui/model/json/JSONListBinding';

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {
	private formatter = formatter;

	public sayHello(): void {
		MessageBox.show('Hello World!');
	}

	public onFindMovie(value: string): void {
		this.showFindingMovieMessage(value);
		this.onFilterCity();
		this.onFilterGenre();
	}

	private onFilterCity() {
		const inputCity = this.getView()
			.byId('city')
			.getProperty('value') as string;
		console.log(inputCity);

		const filterCity = inputCity
			? new Filter('info', FilterOperator.Contains, inputCity)
			: null;

		const rows = this.byId('calendar').getAggregation(
			'rows'
		) as ManagedObject[];

		// rows.forEach((item) => {
		//   const appointmentsBinding = item.getBinding(
		//     'appointments'
		//   ) as JSONListBinding;
		//   appointmentsBinding.filter(filterCity);
		// });
		// const rows2 = <JSONListBinding>this.byId('calendar').getAggregation('rows');
		for (const row of rows) {
			const appointmentsBinding = <JSONListBinding>(
				row.getBinding('appointments')
			);
			appointmentsBinding.filter(filterCity);
		}
	}

	private onFilterGenre() {
		const inputGenre = this.byId('genre').getProperty('selectedKey') as string;
		console.log(inputGenre);

		const filterGenre = inputGenre
			? new Filter('genre', FilterOperator.EQ, inputGenre)
			: null;

		const rows = this.byId('calendar').getAggregation(
			'rows'
		) as ManagedObject[];

		// for (const row of rows) {
		//   const appointmentsBinding = <JSONListBinding>(
		//     row.getBinding('appointments')
		//   );
		//   appointmentsBinding.filter(filterGenre);
		// }
		const rows2 = <JSONListBinding>this.byId('calendar').getBinding('rows');
		rows2.filter(filterGenre);

		console.log(rows);
	}

	private showFindingMovieMessage(value: string) {
		const resourceBundle = <ResourceBundle>this.getResourceBundle();
		const searchingMessage = resourceBundle.getText('search'); //study typescript why error (maybe due to promise)
		MessageToast.show(searchingMessage + '' + value);
		console.log(this);
	}

	public onPressImage(value: string): void {
		MessageToast.show(value);
	}

	public onAppointmentSelectHandler(appointment: ManagedObject): void {
		MessageToast.show('Appointment Selected');
		const context = appointment.getBindingContext('movies');
		const path = context.getPath();

		console.log(path);

		const parameters = path.split('/');
		// UIComponent.getRouterFor(this).navTo('Detail', {});
		console.log(parameters);
		this.navTo('Detail', {
			movieId: parameters[2],
			appointmentsId: parameters[4],
		});
	}
}
