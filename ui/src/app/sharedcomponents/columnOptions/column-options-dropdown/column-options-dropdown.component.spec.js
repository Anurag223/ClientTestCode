"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var column_options_dropdown_component_1 = require("./column-options-dropdown.component");
describe('ColumnOptionsDropdownComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [column_options_dropdown_component_1.ColumnOptionsDropdownComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(column_options_dropdown_component_1.ColumnOptionsDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=column-options-dropdown.component.spec.js.map