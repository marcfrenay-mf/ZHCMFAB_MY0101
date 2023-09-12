/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["hcm/fab/lib/common/controller/PersInfoCommonCountryController.controller", "sap/ui/model/json/JSONModel"], function (P, J) {
	"use strict";
	return P.extend("hcm.fab.my0101.controller.CommonCountryController", {
		doSpecificFieldValidation: function (v, e) {
			if (this.extHookDoSpecificFieldValidation) {
				var c = this.extHookDoSpecificFieldValidation(v, e);
				try {
					v.isOkay = c.isOkay;
					v.errorMessage = c.errorMessage;
					v.oControl = c.oControl;
				} catch (a) {
					return v;
				}
			}
			return v;
		}
	});
});