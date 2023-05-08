import Button from 'sap/m/Button';
import Dialog from 'sap/m/Dialog';
import Label from 'sap/m/Label';
import MessageToast from 'sap/m/MessageToast';
import Text from 'sap/m/Text';
import Toolbar from 'sap/m/Toolbar';
import ToolbarSpacer from 'sap/m/ToolbarSpacer';
import Event from 'sap/ui/base/Event';
import Control from 'sap/ui/core/Control';
import Fragment from 'sap/ui/core/Fragment';
import Controller from 'sap/ui/core/mvc/Controller';
import Popup from 'sap/ui/core/Popup';
import BackdropHandler from '../UIControls/BackdropHandler';

export default class customControlFragment extends Controller {
	private fragmentDialog: Dialog;
	private fragmentOverlay: Popup;

	// private newDialog: Dialog;

	public onInputHandler(): void {
		console.log('Input was pressed!!');
		// const fragment = new Fragment();
		// this.openFragment('test');

		void this.openFragment();
	}

	public async openFragment(): Promise<void> {
		this.fragmentDialog = new Dialog({
			content: await Fragment.load({
				// name: 'com.myorg.myapp.customControls.customControl',
				name: 'com.myorg.myapp.Fragments.messageSample',
				controller: this,
			}),
			title: 'Give some feedback!',
			type: 'Message',
			contentWidth: 'auto',
			contentHeight: 'auto',
			showHeader: true,
		});

		// this.fragment.setData(data);
		if (!this.fragmentDialog) {
			console.error('Fragment not loaded correctly');
			return;
		}
		this.fragmentDialog.open();

		this.fragmentDialog.attachAfterClose((event: Event) => {
			this.fragmentDialog.destroy();
		});
		this.fragmentDialog.attachBrowserEvent('click', (event: Event) => {
			this.fragmentDialog.addStyleClass('customDialog');
		});

		if (this.fragmentDialog.isOpen()) {
			document.addEventListener('click', (event) => {
				const target = event.target as HTMLElement;
				if (!target.closest('.customDialog')) {
					this.fragmentDialog.close();
				}
			});
		}
	}

	public closeFragment(): void {
		this.fragmentDialog.close();
	}

	public onPressCancel(): void {
		this.closeFragment();
	}

	public onOpenDialogHandler(): void {
		MessageToast.show('New is clicked!');

		const dialogProps = {
			text: new Text({ text: 'Sample Text', textAlign: 'Center' }),
			label: new Label({ text: 'Sample Label' }),
			buttonAccept: new Button({
				text: 'Press',
				type: 'Emphasized',
				press: () => {
					MessageToast.show('Accept!');
					dialogTest.close();
				},
			}),
			buttonFail: new Button({
				text: 'Cancel',
				type: 'Neutral',
				press: () => {
					dialogTest.close();
				},
			}),
			toolbarSpacer: new ToolbarSpacer({}),
		};

		const toolbar = new Toolbar({
			content: [
				dialogProps.toolbarSpacer,
				dialogProps.buttonAccept,
				dialogProps.buttonFail,
			],
		});

		const dialog = new Dialog({
			type: 'Message',
			title: 'Confirm',
			content: [
				new Text({ text: 'Sample Text' }),
				new Label({ text: 'Sample Text' }),
				new Button({ text: 'Press', type: 'Accept' }),
			],
		});

		// dialog.open();

		const dialogTest = new Dialog({
			type: 'Standard',
			state: 'Success',
			title: 'Confirm',
			content: [
				dialogProps.text
					.addStyleClass('sapUiSmallMarginBegin')
					.addStyleClass('sapUiSmallMarginTop'),
				toolbar,
			],
		});

		dialogTest.addStyleClass('customDialog');

		if (!dialogTest.isOpen()) {
			dialogTest.open();
		}

		dialogTest.attachAfterClose(() => {
			dialogTest.destroy();
		});

		dialogTest.attachBrowserEvent('click', () => {
			dialogTest.addStyleClass('customDialog');
		});

		new BackdropHandler().onCloseBackdrop(dialogTest);
	}

	public onOpenDialogViaJS(): void {
		const dialogProps = {
			text: new Text({ text: 'Sample Text', textAlign: 'Center' }),
			label: new Label({ text: 'Sample Label' }),
			buttonAccept: new Button({
				text: 'Press',
				type: 'Emphasized',
				press: () => {
					MessageToast.show('Accept!');
					// dialogPromise.close();
				},
			}),
			buttonFail: new Button({
				text: 'Cancel',
				type: 'Neutral',
				press: () => {
					// dialogPromise.close();
				},
			}),
			toolbarSpacer: new ToolbarSpacer({}),
		};

		const toolbar = new Toolbar({
			content: [
				dialogProps.toolbarSpacer,
				dialogProps.buttonAccept,
				dialogProps.buttonFail,
			],
		});

		const dialog = new Dialog({
			type: 'Standard',
			state: 'Success',
			title: 'Confirm',
			content: [
				dialogProps.text
					.addStyleClass('sapUiSmallMarginBegin')
					.addStyleClass('sapUiSmallMarginTop'),
				toolbar,
			],
		});

		const sampleText = new Text();
		sampleText
			.setText('Sample Text')
			.addStyleClass('sapUiSmallMarginBegin')
			.addStyleClass('sapUiSmallMarginTop');

		const sampleButton = new Button();
		sampleButton.setText('Ignore');
		sampleButton.setType('Success');

		const sampleToolBarSpacer = new ToolbarSpacer({});
		const sampleToolBar = new Toolbar();
		sampleToolBar.addContent(sampleText);
		sampleToolBar.addContent(sampleToolBarSpacer);
		sampleToolBar.addContent(sampleButton);

		dialog.addButton(new Button({ text: 'Ignore', type: 'Reject' }));
		dialog.addContent(sampleToolBar);
		// dialog.open();

		const dialogPromise = new Promise((resolve, reject) => {
			if (!dialog.isOpen()) {
				dialog.open();
			}
			new BackdropHandler().onCloseBackdrop(dialog);
			dialog.attachEventOnce('afterClose', (event: Event) => {
				// dialog.open();
				resolve(event);
			});
		});
	}
}
