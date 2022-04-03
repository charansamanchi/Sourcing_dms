sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";
        var oArgs; var new_obj; var new_pub; var currentuser; var route;
        return Controller.extend("publicrepository.controller.View1", {
            onInit: function () {
                this.getView().getModel("userapi");
             var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("RouteView1").attachPatternMatched(function (oEvent) {
                /** Get the publiclink ID and object ID into oArgs*/
              oArgs = oEvent.getParameter("arguments");
              this.getComponentContainer().setSettings(this.getComponentSettings());
            return oArgs;
        },this);
                this.oPage = this.getView().byId("page");
            },
            getUser: function () {
                currentuser = this.getView().getModel("userapi").getProperty("/email"); 
                if ( currentuser ) {
                    return currentuser;  
                }
            },
            callFolderApi : function (oArgs) { 
                this.getUser();
              debugger;
                /** pass the object ID to create folder using Folder API inside Main folder */ 
                        var spathextension = "145f82b9-2bd6-4975-b163-754a93ab9901/root?objectId=" + oArgs.objId;
                        var spath = "FolderAPI/"+ spathextension;
                        var that = this;
                      // to make the URL work outside of CF (Eg: launchpad), pass the relative url to below method.
                      //   var xurl =  this.getOwnerComponent().getManifestObject().resolveUri(spath);
                         var oFormData = new FormData();
                              oFormData.append("cmisaction", "createFolder");
                              oFormData.append("propertyId[0]", "cmis:name");
                              oFormData.append("propertyId[1]", "cmis:objectTypeId");
                              oFormData.append("propertyValue[1]", "cmis:folder"); 
                              oFormData.append("propertyValue[0]", currentuser);
                         $.ajax({
                          type: "POST",
                          data: oFormData,
                          processData: false,
                          enctype: 'multipart/form-data',
                          contentType: false,
                          cache: false,
                          async: false,
                          url: spath,
                          success: function (data, txtStatus, jqXHR) {       
                              debugger; 
                              that.handleResponse(data); 
                          },
                          error: function (jqXhr, textStatus, errorThrown) {
                              debugger;
                              that.handleError(jqXhr, oArgs);
                          }
                      })
            },  
            getComponentSettings: function() {
                
                return  {
                  destinationPath: "/public",
                  publicLinkId: ' '
                };
              },
      
              getComponentContainer: function () {
                return this.oPage.getContent()[0];
            },
            onComponentCreated: function(oEvent) {
                
                this.callFolderApi(oArgs); 
                //this._oDocumentTable = oEvent.getParameter("component");
                // OPTIONAL: set a folder as home folder
                //this._oDocumentTable.setHomeFolder(<OBJECT_ID>);
                // OPTIONAL: request a navigation to a repository & folder during runtime
                //this._oDocumentTable.requestNavigationAndOpen("145f82b9-2bd6-4975-b163-754a93ab9901", "pmPyGBhQcogZX15tYmMlBPhc1dBRBpB2L1EhpQx5aF8");
              this._oDocumentTable = oEvent.getParameter("component");
              // setting the publiclink Id at runtime
              this._oDocumentTable.mProperties.publicLinkId = new_pub;
              this._loadRepositoryAndObjectId();
              },
        
              _loadRepositoryAndObjectId: function () {
                debugger;
                this._oDocumentTable.requestNavigationAndOpen('145f82b9-2bd6-4975-b163-754a93ab9901', new_obj);
            },

            handleResponse: function (data) {
                debugger;
                if ( route != true ) {
                    var resp = data.properties;
                    new_obj = resp["cmis:objectId"]["value"];
                    new_pub = resp["sap:publicLinkId"]["value"];   
                    return new_obj, new_pub;
                } else {
                    var resp = data.objects;
                   var resp1 =  resp.filter(function (y) {
                       return y.object.properties["cmis:name"]["value"] === currentuser});
                    new_obj = resp1[0].object.properties["cmis:objectId"]["value"];
                    new_pub = resp1[0].object.properties["sap:publicLinkId"]["value"];
                    return new_obj, new_pub;
                }
                 
            },

            handleError: function (jqXHR, oArgs) {
               if (jqXHR.responseJSON.exception == 'nameConstraintViolation') {
                   route = true;
                   var that  = this;
                   var spathextension = "145f82b9-2bd6-4975-b163-754a93ab9901/root?objectId=" + oArgs.objId + "&filter=cmis:nameandcmis:objectIdandsap:publicLinkId"
                    var spath = "FolderProperties/"+ spathextension;
                   $.ajax({
                    type: "GET",
                    async: false,
                    url: spath,
                    success: function (data, txtStatus, jqXHR) {       
                        debugger; 
                        that.handleResponse(data);
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        debugger;
                        
                    }
                })
                } else {

               }

            }

        });
    });
