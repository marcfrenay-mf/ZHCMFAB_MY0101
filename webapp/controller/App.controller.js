/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["hcm/fab/my0101/controller/BaseController", "sap/ui/model/json/JSONModel"], function (B, J) {
	"use strict";
	return B.extend("hcm.fab.my0101.controller.App", {
		onInit: function () {
			var v;
			v = new J({
				busy: false,
				delay: 0
			});
			this.setModel(v, "appView");
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});