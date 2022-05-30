import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

import { LoaderService } from 'src/app/base/loader/loader.service';
import { MateoQueue } from 'src/app/base/models/mateoQueue';

/**
 * Tracks the completion status of the Mateo Queue List provided as input.
 * Note: Status is updated only when any of the Input changes.
 *
 * @export
 * @class ProgressBarComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-fmp-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnChanges {
  /**
   * Flag indicating if data load is in progress and Progress Bar should be visible or not.
   *
   * @type {boolean}
   * @memberof ProgressBarComponent
   */
  @Input() loading: boolean;

  /**
   * Message to be displayed in the Progress Bar.
   * Note: Is is run though the translate service and utilizes the parameters input.
   *
   * @type {string}
   * @memberof ProgressBarComponent
   */
  @Input() message: string;

  /**
   * Parameters for the Message when passed through the translate service.
   *
   * @type {*}
   * @memberof ProgressBarComponent
   */
  @Input() paramters: any;

  /**
   * List of MATEO Queue Items to be tracked to completion.
   *
   * @type {MateoQueue<any>[]}
   * @memberof ProgressBarComponent
   */
  @Input() queuelist: MateoQueue<any>[];

  /**
   * Set custom width of the progress bar.
   *
   * @type {number}
   * @memberof ProgressBarComponent
   */
  @Input() width: number;

  title: string;

  /**
   * Calculated Percentage Completion of the MATEO Calls.
   *
   * @type {number}
   * @memberof ProgressBarComponent
   */
  percentComplete: number;
  /**
   * Creates an instance of ProgressBarComponent.
   * @param {LoaderService} loaderService
   * @memberof ProgressBarComponent
   */
  constructor(private loaderService: LoaderService) {
    this.message = 'Loading!!!';
    this.resetProgressBar();
  }

  /**
   * Resets the ProgressBar parameters.
   *
   * @memberof ProgressBarComponent
   */
  public resetProgressBar(): void {
    this.loading = false;
    this.queuelist = [];
    this.paramters = {};
    this.percentComplete = 0;
    this.manageLoader(0, 0);
  }

  /**
   * Toggle the visibility of the ProgressBar.
   * progressbar.toggle() = Toggles between the show/hide of the Progress Bar.
   * progressbar.toggle(true) = Force the Progress Bar to show.
   * progressbar.toggle(false) = Force the Progress Bar to hide.
   *
   * @param {boolean} [show]
   * @memberof ProgressBarComponent
   */
  public toggle(show?: boolean): void {
    const loadingFlag =
      show === null || show === undefined ? !this.loading : show;
    this.loading = loadingFlag;
    if (!this.loading) {
      this.manageLoader(0, 0);
    }
  }

  /**
   * Manage the loader while the MATEO Calls are executing
   *
   * @private
   * @memberof ProgressBarComponent
   */
  private manageLoader(
    totalCallCount: number,
    completedCallCount: number,
  ): void {
    // Loader is visible only from the time the Calls are made till the completion of the first call.
    // Note: completedCallCount === 0 implies not calls are complete. Open the loader.
    if (this.loading && totalCallCount > 0 && completedCallCount === 0) {
      this.loaderService.showSpinner();
    } else {
      // totalCallCount > 0 && completedCallCount is not 0 implies atleast one call has completed and loader is to be closed.
      this.loaderService.hideSpinner();
    }
  }

  /**
   * Recalculate Percentage completion when loading is true and any input of the progress bar changes.
   * Note: Since the progress is calculated in the ngOnChanges, Progress will not be reflected untill any of the inputs change.
   * Inputs: loading: boolean, message: string, paramters: any, queuelist: MateoQueue<any>[], width: number.
   *
   * @param {SimpleChanges} changes
   * @memberof ProgressBarComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.loading && this.queuelist && this.queuelist.length > 0) {
      // Find List of calls that have completed
      const completedQueueList = this.queuelist.filter(
        queue => !queue.HasToProcess,
      );
      // Calculate % completion and round it.
      this.percentComplete = Math.round(
        ((completedQueueList.length / this.queuelist.length) * 100) % 100,
      );
      // If completion % is less than 100 show progress else hide progress bar.
      this.loading = this.percentComplete < 100;
      // Additional information to be displayed on hover of the Progress Bar.
      this.title = `Total Calls: ${this.queuelist.length}, Completed Calls: ${
        completedQueueList.length
      }, Percentage Complete: ${this.percentComplete}.`;
      this.manageLoader(this.queuelist.length, completedQueueList.length);
    } else {
      this.percentComplete = 0;
      this.loading = false;
      this.manageLoader(0, 0);
    }
  }
}

/**
 * Model type for the Progress Bar.
 *
 * @export
 * @interface IProgressBarModel
 */
export interface IProgressBarModel {
  loading: boolean;
  queueItems: MateoQueue<any>[];
  message: string;
  parameters: any;
}
