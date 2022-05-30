import {
  Directive,
  AfterViewChecked,
  Input,
  ElementRef,
  DoCheck,
  NgZone,
  OnChanges,
} from '@angular/core';

import { FMPHelper } from 'src/Constants/helpers';
import { LoggerService } from 'src/app/base/service/logger.service';

/**
 * This directive when applied on any element in Html takes the element and
 * add the contextual help it into the first target element found based on the "targetContextSelector" and "contextKey"  provided.
 *
 * @export
 * @class ContextElementDirective
 * @implements {AfterViewChecked}
 */
@Directive({
  selector: '[appFmpContextHelpElement]',
})
export class ContextHelpElementDirective implements AfterViewChecked {
  /**
   *Creates an instance of ContextElementDirective.
   * @param {ElementRef} element
   * @param {LoggerService} _logger
   * @memberof ContextElementDirective
   */
  constructor(private element: ElementRef, private _logger: LoggerService) {}

  /**
   * The selector for the intended target element provided as input to the directive.
   *
   * @type {string}
   * @memberof ContextElementDirective
   */
  @Input() targetContextSelector: string;
  @Input() targetContextKey: string;

  /**
   * Directive runs every time after the view is checked.
   * It finds the target element based on the selector provided.
   * It then appends the source element on which the directive was applied to the first target element found.
   *
   * @memberof ContextElementDirective
   */
  ngAfterViewChecked(): void {
    try {
      // Check source element and target selector are valid.
      if (
        this.element &&
        !FMPHelper.StringIsNullOrWhiteSpace(this.targetContextSelector)
      ) {
        // Find target elements based on selector provided.

        const targets = document.querySelectorAll(this.targetContextSelector);
        if (targets && targets.length > 0) {
          // If target element/elements are found append source to the first target element.
          targets[0].setAttribute('contexthelp', this.targetContextKey);
        }
      }
    } catch (ex) {
      // Log error with details in case the contextTarget throws an exception.
      this._logger.WriteError(
        'RepositionElementDirective',
        'Error while repositioning the source element.',
        new Map()
          .set('source', this.element)
          .set('target', this.targetContextSelector)
          .set('error', ex),
      );
    }
  }
}
