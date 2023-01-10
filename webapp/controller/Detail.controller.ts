/**
 * @namespace com.myorg.myapp.controller
 */

import Event from 'sap/ui/base/Event';
import BaseController from './BaseController';

interface EventWithIDArgument {
	getParameter(name: 'arguments'): { movieId: string; appointmentsId: string };
}

export default class Detail extends BaseController {
	public onInit(): void {
		this.getRouter()
			.getRoute('Detail')
			.attachPatternMatched(this.onDetailMatched.bind(this));
	}

	private onDetailMatched(event: Event & EventWithIDArgument): void {
		const movieIndex = event.getParameter('arguments').movieId;
		const appointmentIndex = event.getParameter('arguments').appointmentsId;
		const view = this.getView();
		view.bindElement({
			path: '/movies/' + movieIndex + '/appointments/' + appointmentIndex,
			model: 'movies',
			events: {
				change: this.onBindingChange.bind(this),
			},
		});
	}

	private onBindingChange(): void {
		const view = this.getView();
		const elementBinding = view.getElementBinding('movies');
		const path = elementBinding.getPath();

		if (!view.getModel('movies').getObject(path)) {
			void this.getRouter().getTargets().display('NotFound');
		}
	}
}
