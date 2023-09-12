/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.predefine('hcm/fab/my0101/Component', ["sap/ui/core/UIComponent", "sap/ui/Device", "hcm/fab/my0101/model/models",
	"hcm/fab/my0101/controller/ErrorHandler"
], function (U, D, m, E) {
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
sap.ui.predefine('hcm/fab/my0101/controller/App.controller', ["hcm/fab/my0101/controller/BaseController", "sap/ui/model/json/JSONModel"],
	function (B, J) {
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
sap.ui.predefine('hcm/fab/my0101/controller/BaseController', ["sap/ui/core/mvc/Controller"], function (C) {
	"use strict";
	return C.extend("hcm.fab.my0101.controller.BaseController", {
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel: function (n) {
			return this.getView().getModel(n);
		},
		setModel: function (m, n) {
			return this.getView().setModel(m, n);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onShareEmailPress: function () {
			var v = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(null, v.getProperty("/shareSendEmailSubject"), v.getProperty("/shareSendEmailMessage"));
		}
	});
});
sap.ui.predefine('hcm/fab/my0101/controller/CommonCountryController.controller', [
	"hcm/fab/lib/common/controller/PersInfoCommonCountryController.controller", "sap/ui/model/json/JSONModel"
], function (P, J) {
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
sap.ui.predefine('hcm/fab/my0101/controller/ErrorHandler', ["sap/ui/base/Object", "sap/m/MessageBox", "sap/m/MessageToast"], function (U, M,
	a) {
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
sap.ui.predefine('hcm/fab/my0101/controller/Main.controller', ["hcm/fab/lib/common/util/CommonModelManager",
	"hcm/fab/my0101/controller/BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History",
	"hcm/fab/my0101/model/formatter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (C, B, M, J, H, f, F, a) {
	"use strict";
	return B.extend("hcm.fab.my0101.controller.Main", {
		formatter: f,
		extHookGetCustomEntityNameForVersionId: null,
		extHookAdjustObjectPageHeaderTitle: null,
		extHookAdjustObjectPageHeaderContent: null,
		onInit: function () {
			var l = new J({
				assignmentId: null
			});
			this.getView().setModel(l, "local");
			C.getDefaultAssignment("my0101").then(function (d) {
				if (!d) {
					M.error(this.getResourceBundle().getText("noAssignment"), {});
				} else {
					l.setProperty("/assignmentId", d.EmployeeId);
				}
			}.bind(this));
		},
		onExit: function (e) {
			C.setSelectedAssignment(null, "my0101");
		},
		getCustomEntityNameForVersionId: function (v) {
			if (this.extHookGetCustomEntityNameForVersionId) {
				var c = this.extHookGetCustomEntityNameForVersionId(v);
				return c;
			}
			return null;
		},
		adjustObjectPageHeader: function (p) {
			if (this.extHookAdjustObjectPageHeaderTitle) {
				p.oObjectPageHeaderTitle = this.extHookAdjustObjectPageHeaderTitle(p.oObjectPageHeaderTitle);
			}
			if (this.extHookAdjustObjectPageHeaderContent) {
				p.aObjectPageHeaderContent = this.extHookAdjustObjectPageHeaderContent(p.aObjectPageHeaderContent);
			}
			return p;
		}
	});
});
sap.ui.predefine('hcm/fab/my0101/model/formatter', [], function () {
	"use strict";
	return {
		numberUnit: function (v) {
			if (!v) {
				return "";
			}
			return parseFloat(v).toFixed(2);
		}
	};
});
sap.ui.predefine('hcm/fab/my0101/model/models', ["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (J, D) {
	"use strict";
	return {
		createDeviceModel: function () {
			var m = new J(D);
			m.setDefaultBindingMode("OneWay");
			return m;
		},
		createFLPModel: function () {
			var g = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				i = g ? g().isJamActive() : false,
				m = new J({
					isShareInJamActive: i
				});
			m.setDefaultBindingMode("OneWay");
			return m;
		}
	};
});