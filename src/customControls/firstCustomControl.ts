import Input from 'sap/m/Input';
import Label from 'sap/m/Label';
import Text from 'sap/m/Text';
import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';

export default class firstCustomControl extends Control {
	init(): void {
		const vBox = new VBox();

		const label = new Label();
		label.setText('Label');

		const input = new Input();

		const text = new Text();
		text.setText('Sample Text');

		// vBox.setAggregation('label', label);
		// vBox.setAggregation('text', text);
		vBox.addItem(label);
		vBox.addItem(text);
	}
}
