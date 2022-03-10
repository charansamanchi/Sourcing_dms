sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";
        var oArgs; var oView;
        return Controller.extend("publicrepository.controller.View1", {
            onInit: function () {
                debugger;
                var oRouter = this.getOwnerComponent().getRouter();
			   oRouter.getRoute("RouteView1").attachPatternMatched(function (oEvent) {
                debugger;
              oArgs = oEvent.getParameter("arguments");
              this.getComponentContainer().setSettings(this.getComponentSettings());
            },this);
                this.oPage = this.getView().byId("page");
            },

            getComponentSettings: function() {
                debugger;
                return  {
                  destinationPath: "/public",
                  publicLinkId: oArgs.pubid
                };
              },
      
              getComponentContainer: function () {
                return this.oPage.getContent()[0];
            },
            onComponentCreated: function(oEvent) {
                debugger;
                //this._oDocumentTable = oEvent.getParameter("component");
                // OPTIONAL: set a folder as home folder
                //this._oDocumentTable.setHomeFolder(<OBJECT_ID>);
                // OPTIONAL: request a navigation to a repository & folder during runtime
                //this._oDocumentTable.requestNavigationAndOpen("145f82b9-2bd6-4975-b163-754a93ab9901", "pmPyGBhQcogZX15tYmMlBPhc1dBRBpB2L1EhpQx5aF8");
        
              this._oDocumentTable = oEvent.getParameter("component");
              this._loadRepositoryAndObjectId();
              },
        
              _loadRepositoryAndObjectId: function () {
                this._oDocumentTable.requestNavigationAndOpen('145f82b9-2bd6-4975-b163-754a93ab9901', oArgs.objId);
            }
        });
    });
