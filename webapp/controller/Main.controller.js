/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["hcm/fab/lib/common/util/CommonModelManager", "hcm/fab/my0101/controller/BaseController", "sap/m/MessageBox",
	"sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "hcm/fab/my0101/model/formatter", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
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