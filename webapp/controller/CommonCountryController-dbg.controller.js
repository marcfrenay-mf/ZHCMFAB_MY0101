/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global location*/
sap.ui.define([
	"hcm/fab/lib/common/controller/PersInfoCommonCountryController.controller",
	"sap/ui/model/json/JSONModel"
], function (
	PersInfoCommonCountryController,
	JSONModel
) {

	"use strict";

	return PersInfoCommonCountryController.extend("hcm.fab.my0101.controller.CommonCountryController", {

		doSpecificFieldValidation: function (oValidation, oEvent) {
			/**    
			 * @ControllerHook
			 * Allows to do customer-specific field validation
			 * oValidation: {isOkay: boolean
				             errorMessage: string
					         oControl: sap.ui.core.Control} 
			 * @callback hcm.fab.my0101.controller.CommonCountryController~extHookDoSpecificFieldValidation  
			 * @param {object} oValidation
			 * @param {sap.ui.base.Event} oEvent
			 * @return {object} oCustomerValidation
			 */
			if (this.extHookDoSpecificFieldValidation) { // check whether any extension has implemented the hook...
				var oCustomerValidation = this.extHookDoSpecificFieldValidation(oValidation, oEvent); // ...and call it
				try {
					oValidation.isOkay = oCustomerValidation.isOkay;
					oValidation.errorMessage = oCustomerValidation.errorMessage;
					oValidation.oControl = oCustomerValidation.oControl;
				} catch (err) {
					return oValidation;
				}
			}
			return oValidation;
		}
	});

});