import Button from 'sap/m/Button';

export default Button.extend(
	'com.myorg.myapp.customControls.dragAndDropButton',
	{
		metadata: {
			dnd: { droppable: true },
		},
		renderer: {},
	}
);

// export class AnotherDragAndDropButton extends Button {
// 	metadata = {
// 		dnd: { droppable: true },
// 	};
// }

// export class YetAnotherDragAndDropButton extends Button {
// 	metadata = {
// 		dnd: { droppable: true },
// 	};
// }

// // Import the droppable buttons from the customControls module
// import DragAndDropButton from './customControls/dragAndDropButton';
// import AnotherDragAndDropButton from './customControls/anotherDragAndDropButton';

// // Add both buttons to the view controller
// sap.ui.define(['sap/ui/core/mvc/XMLView'], function (XMLView) {
//   'use strict';

//   XMLView.create({
//     viewName: 'com.myorg.mapp.view.Main',
//     controller: new (sap.ui.controller('com.myorg.myapp.controller.Main'))(),
//     async: true,
//   }).then(function (view) {
//     // Add the view to the page
//     view.placeAt('content');

//     // Get the root element of the view
//     const root = view.byId('root');

//     // Create the droppable buttons
//     const dragAndDropButton = new DragAndDropButton({
//       icon: 'sap-icon://delete',
//       droppable: true,
//       dragDropConfig: new sap.ui.core.dnd.DragDropInfo({
//         drop: '.onDelete',
//       }),
//     });
//     const anotherDragAndDropButton = new AnotherDragAndDropButton({
//       icon: 'sap-icon://add',
//       droppable: true,
//       dragDropConfig: new sap.ui.core.dnd.DragDropInfo({
//         drop: '.onAdd',
//       }),
//     });

//     // Add the droppable buttons to the view
//     root.addItem(dragAndDropButton);
//     root.addItem(anotherDragAndDropButton);
//   });
// });

// sap.ui.define(['sap/m/Button'], function (Button) {
// 	'use strict';
// 	// return Button.extend('opensap.orders.control.DeleteButton', {
// 	return Button.extend('com.myorg.myapp.customControls.Button', {
// 		metadata: {
// 			dnd: { droppable: true },
// 		},
// 		renderer: {},
// 	});
// });
