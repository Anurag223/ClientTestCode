import { Pipe, PipeTransform, ElementRef, NgZone } from '@angular/core';
import * as $ from 'jquery';


/**
 * This is an impure pipe create to move the carrat symbol of the expand/collapse to the first row of the filter row.
 *
 * @export
 * @class PositionExpandCollpasePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'positionExpandCollpase',
  pure: false
})
export class PositionExpandCollpasePipe implements PipeTransform {
  constructor(private angularZone: NgZone) { }


  /**
   *  An impure pipe transform which is used to move the carrat of Expand/Collapse.
   *
   * @param {ElementRef} element
   * @returns {string}
   * @memberof PositionExpandCollpasePipe
   */
  transform(element: ElementRef): string {
    this.angularZone.runOutsideAngular(() => this.positionExpanCollapseControl(element));
    return '';
  }


  /**
   * Method that runs outsite Angular Zone and moves the Expand/Collapse carrat to the first cell of the 
   * filter column.
   * The content is moved only if the element is not already under the grouping cell.
   *
   * @param {ElementRef} element
   * @memberof PositionExpandCollpasePipe
   */
  positionExpanCollapseControl(element: ElementRef): void {
    const source = $(element);
    const target = $('.k-grid .k-grid-header .k-filter-row td:first')
    if (source.length > 0 && target.length > 0) {
      source.appendTo(target);
      source.css('text-align', 'center');
    }
  }
}
