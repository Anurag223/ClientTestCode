'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
var kendo_angular_conversational_ui_1 = require('@progress/kendo-angular-conversational-ui');
var CustomAction = /** @class */ (function() {
  function CustomAction() {}
  return CustomAction;
})();
exports.CustomAction = CustomAction;
var CustomComment = /** @class */ (function() {
  function CustomComment() {}
  return CustomComment;
})();
exports.CustomComment = CustomComment;
var CustomSendMessageEvent = /** @class */ (function(_super) {
  __extends(CustomSendMessageEvent, _super);
  function CustomSendMessageEvent() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return CustomSendMessageEvent;
})(kendo_angular_conversational_ui_1.SendMessageEvent);
exports.CustomSendMessageEvent = CustomSendMessageEvent;
//# sourceMappingURL=applicationcomments.model.js.map
