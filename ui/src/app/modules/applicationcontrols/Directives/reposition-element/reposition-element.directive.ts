import {
  Directive,
  ElementRef,
  Input,
  DoCheck,
  NgZone,
  AfterViewChecked,
} from '@angular/core';
import { FMPHelper } from 'src/Constants/helpers';
import { LoggerService } from 'src/app/base/service/logger.service';

/**
 * This directive when applied on any element in Html takes the element and
 * Repositions it into the first target element found based on the "targetSelector" provided.
 *
 * @export
 * @class RepositionElementDirective
 * @implements {AfterViewChecked}
 */
@Directive({
  selector: '[appFmpRepositionElement]',
})
export class RepositionElementDirective implements AfterViewChecked {
  /**
   *Creates an instance of RepositionElementDirective.
   * @param {ElementRef} element
   * @param {LoggerService} _logger
   * @memberof RepositionElementDirective
   */
  constructor(private element: ElementRef, private _logger: LoggerService) {}

  /**
   * The selector for the intended target element provided as input to the directive.
   *
   * @type {string}
   * @memberof RepositionElementDirective
   */
  @Input() targetSelector: string;

  /**
   * Directive runs every time after the view is checked.
   * It finds the target element based on the selector provided.
   * It then appends the source element on which the directive was applied to the first target element found.
   *
   * @memberof RepositionElementDirective
   */
  ngAfterViewChecked(): void {
    try {
      // Check source element and target selector are valid.
      if (
        this.element &&
        !FMPHelper.StringIsNullOrWhiteSpace(this.targetSelector)
      ) {
        // Find target elements based on selector provided.
        const targets = document.querySelectorAll(this.targetSelector);
        if (targets && targets.length > 0) {
          // If target element/elements are found append source to the first target element.
          targets[0].appendChild(this.element.nativeElement);
        }
      }
    } catch (ex) {
      // Log error with details in case the repositioning throws an exception.
      this._logger.WriteError(
        'RepositionElementDirective',
        'Error while repositioning the source element.',
        new Map()
          .set('source', this.element)
          .set('target', this.targetSelector)
          .set('error', ex),
      );
    }
  }
}
