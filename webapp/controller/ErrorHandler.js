/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object", "sap/m/MessageBox", "sap/m/MessageToast"], function (U, M, a) {
	"use strict";
	return U.extend("hcm.fab.my0101.controller.ErrorHandler", {
		constructor: function (c) {
			this._bShowExceptionsOnly = false;
			this._oResourceBundle = c.getModel("i18n").getResourceBundle();
			this._oComponent = c;
			this._oModel = c.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");
			this._oModel.attachMetadataFailed(function (e) {
				var p = e.getParameters();
				this._showMetadataError(p.response);
			}, this);
			this._oModel.attachRequestFailed(function (e) {
				var p = e.getParameters();
				var C = p.response.headers["Content-Type"];
				if (C && C.indexOf("application/json") !== -1) {
					if (p.response.responseText.indexOf("/IWBEP/CX_MGW_BUSI_EXCEPTION") !== -1) {
						return;
					}
					if (this._bShowExceptionsOnly) {
						if (p.response.responseText.indexOf("SY/530") === -1) {
							return;
						}
					}
					if (p.response.responseText.indexOf("HCMFAB_COMMON/009") !== -1) {
						return;
					}
					if (p.response.responseText.indexOf("PBAS_SERVICE/001") !== -1) {
						return;
					}
				}
				if (p.response.statusCode !== "404" || (p.response.statusCode === 404 && p.response.responseText.indexOf("Cannot POST") === 0)) {
					this._showServiceError(p.response);
				}
			}, this);
		},
		_showMetadataError: function (d) {
			M.error(this._sErrorText, {
				id: "metadataErrorMessageBox",
				details: d,
				styleClass: this._oComponent.getContentDensityClass(),
				actions: [M.Action.RETRY, M.Action.CLOSE],
				onClose: function (A) {
					if (A === M.Action.RETRY) {
						this._oModel.refreshMetadata();
					}
				}.bind(this)
			});
		},
		_showServiceError: function (d) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			M.error(this._sErrorText, {
				id: "serviceErrorMessageBox",
				details: d,
				styleClass: this._oComponent.getContentDensityClass(),
				actions: [M.Action.CLOSE],
				onClose: function () {
					this._bMessageOpen = false;
				}.bind(this)
			});
		},
		setShowExceptionsOnly: function (s) {
			this._bShowExceptionsOnly = s;
		}
	});
});