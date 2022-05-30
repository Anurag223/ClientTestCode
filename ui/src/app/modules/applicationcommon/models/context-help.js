'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ContextHelpDirection;
(function(ContextHelpDirection) {
  ContextHelpDirection['Top'] = 'TOP';
  ContextHelpDirection['Bottom'] = 'BOTTOM';
  ContextHelpDirection['Left'] = 'LEFT';
  ContextHelpDirection['Right'] = 'RIGHT';
})(
  (ContextHelpDirection =
    exports.ContextHelpDirection || (exports.ContextHelpDirection = {})),
);
var ContextHelpModel = /** @class */ (function() {
  function ContextHelpModel(context) {
    if (context) {
      this.contextID = context.contextID;
      this.contextCode = context.contextCode;
      this.direction = context.direction;
      this.requireBorder = context.requireBorder;
      this.headerHtml = context.headerHtml;
      this.bodyHtml = context.bodyHtml;
      this.wikiHyperLink = context.wikiHyperLink;
    }
  }
  return ContextHelpModel;
})();
exports.ContextHelpModel = ContextHelpModel;
var ContextHelpDetails = /** @class */ (function() {
  function ContextHelpDetails() {}
  return ContextHelpDetails;
})();
exports.ContextHelpDetails = ContextHelpDetails;
var ElementPosition = /** @class */ (function() {
  function ElementPosition() {}
  return ElementPosition;
})();
exports.ElementPosition = ElementPosition;
var ContextHelpDataModel = /** @class */ (function() {
  function ContextHelpDataModel() {}
  return ContextHelpDataModel;
})();
exports.ContextHelpDataModel = ContextHelpDataModel;
var ContextHelpConfiguration = /** @class */ (function() {
  function ContextHelpConfiguration() {}
  return ContextHelpConfiguration;
})();
exports.ContextHelpConfiguration = ContextHelpConfiguration;
//# sourceMappingURL=context-help.js.map
