import Dialog from 'sap/m/Dialog';
export default class BackdropHandler {
	// onCloseBackdrop(dialog: Dialog): void {
	// 	if (dialog.isOpen()) {
	// 		document.addEventListener('click', (event) => {
	// 			const clickedElement = event.target as HTMLElement;
	// 			const dialogElement = document.querySelector('.customDialog');
	// 			if (dialogElement && !dialogElement.contains(clickedElement)) {
	// 				dialog.close();
	// 			}
	// 			// if (!target.closest('customDialog')) {
	// 			// 	dialog.close();
	// 			// }
	// 		});
	// 	}
	// 	if (dialog.isOpen()) {
	// 		document.addEventListener('click', (event) => {
	// 			const clickedElement = event.target as HTMLElement;

	// 			if (!clickedElement.closest('.customDialog')) {
	// 				// console.log('Clicked outside the dialog!');
	// 				dialog.close();
	// 			}
	// 		});
	// 	}
	// }
	onCloseBackdrop(dialog: Dialog): void {
		const clickHandler = (event: Event) => {
			const clickedElement = event.target as HTMLElement;

			const dialogElement = dialog.getDomRef();

			if (dialogElement && !dialogElement.contains(clickedElement)) {
				dialog.close();
			}
		};

		dialog.addStyleClass('customDialog');

		if (dialog.isOpen()) {
			document.addEventListener('click', clickHandler);
		} else {
			document.removeEventListener('click', clickHandler);
		}
	}
}
