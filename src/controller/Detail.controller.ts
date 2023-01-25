import BaseController from './BaseController';
import JSONModel from 'sap/ui/model/json/JSONModel';
import formatter from '../model/formatter';
import UI5Event from 'sap/ui/base/Event';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
import { inputParameters } from './App.controller';
import { system } from 'sap/ui/Device';
import Button from 'sap/m/Button';
import Component, { UIState } from '../Component';
import ListItem from 'sap/ui/core/ListItem';

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Detail extends BaseController {
  private id: string;
  private formatter = formatter;
  public onInit(): void {
    const viewModel = new JSONModel({
      busy: false,
      delay: 0,
    });
    this.setModel(viewModel, 'detailView');

    this.getRouter()
      .getRoute('detail')
      .attachPatternMatched(
        (event: UI5Event) => this.onObjectMatched(event),
        this
      );

    this.getRouter()
      .getRoute('third')
      .attachPatternMatched(
        (event: UI5Event) => this.onObjectMatched(event),
        this
      );
  }

  private onObjectMatched(event: UI5Event): void {
    const viewModel = this.getModel('detailView') as JSONModel;

    this.id =
      (event.getParameter('arguments') as inputParameters).id || this.id || '0';

    if (!this.id) {
      return;
    }
    if (event.getParameter('name') === 'object') {
      (this.getModel('appView') as JSONModel).setProperty(
        '/layout',
        // 'TwoColumnsMidExpanded'
        'ThreeColumnsMidExpanded'
      );
    }

    void (this.getModel() as ODataModel).metadataLoaded().then(() => {
      const path = (this.getModel() as ODataModel).createKey('/Products', {
        ID: this.id,
      });

      this.getView().bindElement({
        path: path,
        events: {
          change: () => this.onBindingChange(),
          dataRequested: () => {
            viewModel.setProperty('/busy', true);
          },
          dataReceived: function () {
            viewModel.setProperty('/busy', false);
          },
        },
      });
    });
  }

  private onBindingChange() {
    const elementBinding = this.getView().getElementBinding();
    // No data for the binding
    if (!elementBinding.getBoundContext()) {
      void this.getRouter().getTargets().display('detailObjectNotFound');
    }
  }

  public onCloseDetailPress(): void {
    (this.getModel('appView') as JSONModel).setProperty(
      '/actionButtonsInfo/midColumn/fullScreen',
      false
    );
    this.getRouter().navTo('master');
  }

  public handleFullScreen(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/midColumn/fullScreen'
    ) as string;
    this.getRouter().navTo('detail', { layout: nextLayout, id: this.id });
  }

  public handleExitFullScreen(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/midColumn/exitFullScreen'
    ) as string;
    this.getRouter().navTo('detail', { layout: nextLayout, id: this.id });
  }

  public handleClose(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/midColumn/closeColumn'
    ) as string;
    this.getRouter().navTo('master', { layout: nextLayout });
  }

  //Additional
  private async onShowCategories(event: UI5Event): Promise<void> {
    const replace = !system.phone;
    const id = (event.getSource() as Button)
      .getBindingContext()
      .getProperty('ID') as number;
    const helper = await (this.getOwnerComponent() as Component).getHelper();
    const nextUIState = helper.getNextUIState(2) as UIState;
    this.getRouter().navTo(
      'third',
      { id: id, layout: nextUIState.layout },
      {},
      replace
    );
  }

  private async onListCategoriesHandler(event: UI5Event): Promise<void> {
    const replace = !system.phone;
    const id = (event.getSource() as ListItem)
      .getBindingContext()
      .getProperty('ID') as number;

    const context = (event.getSource() as ListItem).getBindingContext();
    const newID = context.getProperty('ID') as number;

    const context2 = this.getView()
      .byId('objAttrCategoryID')
      .getBindingContext();
    const newID2 = context.getProperty('ID') as number;

    console.log(context2);
    console.log(newID2);

    console.log(event);
    console.log(context);
    console.log(newID);
    const helper = await (this.getOwnerComponent() as Component).getHelper();
    const nextUIState = helper.getNextUIState(2) as UIState;
    this.getRouter().navTo(
      'third',
      { id: id, layout: nextUIState.layout },
      {},
      replace
    );
  }
}
