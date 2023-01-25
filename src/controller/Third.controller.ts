import BaseController from './BaseController';
import UI5Event from 'sap/ui/base/Event';
import JSONModel from 'sap/ui/model/json/JSONModel';
import ODataModel from 'sap/ui/model/odata/v2/ODataModel';
import { inputParameters } from './App.controller';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import List from 'sap/m/List';
import StandardListItem from 'sap/m/StandardListItem';

interface MyArguments {
  id: string;
}
/**
 * @namespace com.myorg.myapp.controller
 */
export default class Third extends BaseController {
  private id: string;

  public onInit(): void {
    this.getRouter()
      .getRoute('third')
      .attachPatternMatched(
        (event: UI5Event) => this.onObjectMatched(event),
        this
      );
  }

  private onObjectMatched(event: UI5Event): void {
    const viewModel = this.getModel('Products') as JSONModel;
    this.id =
      (event.getParameter('arguments') as inputParameters).id || this.id || '0';
    // const path = (this.getModel() as ODataModel).createKey('/Products', {
    //   ID: this.id,
    // });

    const parameterArguments = event.getParameter('arguments') as MyArguments;
    const model = this.getView().getModel();

    // const testModel = this.getView().getBindingContext().getModel();

    const filter = new Filter({
      filters: [new Filter('ID', FilterOperator.EQ, parameterArguments.id)],
      and: true,
    });
    // const thirdListBinding = this.getView().byId('thirdList').bindAggregation("items", {
    //   path: '/items',
    //   filters: filter
    // }) as ListBinding;

    const list = this.getView().byId('thirdList') as List;
    list.bindItems({
      path: '/Products',
      filters: [new Filter('ID', FilterOperator.EQ, parameterArguments.id)],
      template: new StandardListItem({
        title: '{Name}',
        description: '{Description}',
      }),
    });
    // model.getBinding('items').filter(filter);

    console.log(parameterArguments, parameterArguments.id);
    console.log(model);
    console.log(filter);
    console.log(list);

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

  public handleFullScreen(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/endColumn/fullScreen'
    ) as string;

    this.getRouter().navTo('third', { layout: nextLayout, id: this.id });
  }

  public handleExitFullScreen(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/endColumn/exitFullScreen'
    ) as string;
    this.getRouter().navTo('detail', { layout: nextLayout, id: this.id });
  }

  public handleClose(): void {
    const nextLayout = (this.getModel('appView') as JSONModel).getProperty(
      '/actionButtonsInfo/endColumn/closeColumn'
    ) as string;
    this.getRouter().navTo('master', { layout: nextLayout });
  }
}
