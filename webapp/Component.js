/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "hcm/fab/my0101/model/models", "hcm/fab/my0101/controller/ErrorHandler"],
	function (U, D, m, E) {
		"use strict";
		return U.extend("hcm.fab.my0101.Component", {
			metadata: {
				manifest: "json"
			},
			init: function () {
				U.prototype.init.apply(this, arguments);
				this._oErrorHandler = new E(this);
				this.setModel(m.createDeviceModel(), "device");
				this.setModel(m.createFLPModel(), "FLP");
				this.getRouter().initialize();
			},
			destroy: function () {
				this._oErrorHandler.destroy();
				U.prototype.destroy.apply(this, arguments);
			},
			getContentDensityClass: function () {
				if (this._sContentDensityClass === undefined) {
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!D.support.touch) {
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
			setShowExceptionsOnly: function (s) {
				this._oErrorHandler.setShowExceptionsOnly(s);
			}
		});
	});