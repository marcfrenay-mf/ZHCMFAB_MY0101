/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"hcm/fab/lib/common/util/CommonModelManager",
	"hcm/fab/my0101/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"hcm/fab/my0101/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (CommonModelManager, BaseController, MessageBox, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("hcm.fab.my0101.controller.Main", {

		formatter: formatter,
		extHookGetCustomEntityNameForVersionId: null,
		extHookAdjustObjectPageHeaderTitle: null,
		extHookAdjustObjectPageHeaderContent: null,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated .
		 * @public
		 */
		onInit: function () {
			var oLocalModel = new JSONModel({
				assignmentId: null
			});
			this.getView().setModel(oLocalModel, "local");

			// Load default assignment and pass it to the control
			CommonModelManager.getDefaultAssignment("my0101").then(function (defaultAssignment) {
				if (!defaultAssignment) {
					MessageBox.error(
						this.getResourceBundle().getText("noAssignment"), {});
				} else {
					oLocalModel.setProperty("/assignmentId", defaultAssignment.EmployeeId);
				}
			}.bind(this));
		},

		onExit: function (oEvent) {
			CommonModelManager.setSelectedAssignment(null, "my0101");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/* methods called by the PersInfoControl                       */
		/* =========================================================== */

		getCustomEntityNameForVersionId: function (sVersionId) {
			/**    
			 * @ControllerHook
			 * Allows you to return a different EntityName for an already existing country screen and
			 * also lets you define a new VersionId/EntityName pair for a newly created country. 
			 * @callback hcm.fab.myaddresses.controller.Main~extHookGetCustomEntityNameForVersionId  
			 * @param {string} sVersionId
			 * @return {string}
			 */
			if (this.extHookGetCustomEntityNameForVersionId) { // check whether any extension has implemented the hook...
				var sCustomEntityName = this.extHookGetCustomEntityNameForVersionId(sVersionId); // ...and call it
				return sCustomEntityName;
			}
			return null;
		},

		adjustObjectPageHeader: function (oPageHeader) {
			/**    
			 * @ControllerHook
			 * Allows to adjust the object page header title
			 * @callback hcm.fab.my0101.controller.Main~extHookAdjustObjectPageHeaderTitle  
			 * @param {sap.uxap.IHeaderTitle} oObjectPageHeaderTitle
			 * @return {sap.uxap.IHeaderTitle} 
			 */
			if (this.extHookAdjustObjectPageHeaderTitle) { // check whether any extension has implemented the hook...
				oPageHeader.oObjectPageHeaderTitle = this.extHookAdjustObjectPageHeaderTitle(oPageHeader.oObjectPageHeaderTitle); // ...and call it
			}

			/**    
			 * @ControllerHook
			 * Allows to adjust the object page header content
			 * @callback hcm.fab.my0101.controller.Main~extHookAdjustObjectPageHeaderContent  
			 * @param {sap.ui.core.Control[]} aObjectPageHeaderContent
			 * @return {sap.ui.core.Control[]} 
			 */
			if (this.extHookAdjustObjectPageHeaderContent) { // check whether any extension has implemented the hook...
				oPageHeader.aObjectPageHeaderContent = this.extHookAdjustObjectPageHeaderContent(oPageHeader.aObjectPageHeaderContent); // ...and call it
			}
			return oPageHeader;
		}
	});
});