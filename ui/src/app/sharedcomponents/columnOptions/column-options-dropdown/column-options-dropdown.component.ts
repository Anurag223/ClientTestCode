import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import {
  SideNavViewModel,
  Layout,
  ILayout,
  IActiveLayout,
  LayoutTypes,
} from '../../../sharedcomponents/models/sidenav-overlay';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { ColumnOptionsService } from '../../../sharedcomponents/columnOptions/columnoptions.service';
import { GridConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { Subscription } from 'rxjs';
import { FMPHelper } from '../../../../Constants/helpers';
import { ColumnComponent } from '@progress/kendo-angular-grid';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { FMPConstant } from '../../../../Constants/constant';
import * as LO from 'lodash';
import { PatchJson } from '../../../base/models/patchjson';
import { UserprofileService } from '../../../base/userprofile/userprofile.service';

@Component({
  selector: 'app-fmp-column-options-dropdown',
  templateUrl: './column-options-dropdown.component.html',
  styleUrls: ['./column-options-dropdown.component.scss'],
})
export class ColumnOptionsDropdownComponent extends BaseComponent
  implements OnInit, OnChanges, OnDestroy {
  viewModel: SideNavViewModel;
  @Input() gridModel: GridConfigModel;
  @Input() application: string;
  @Input() fixedColumns: number[] = [];
  @Input() enableManageViews = true;
  @Input() enablePublicViews = true;

  @Output() open: EventEmitter<
    ColumnOptionsDropdownComponent
  > = new EventEmitter();
  @Output() change: EventEmitter<Layout> = new EventEmitter();
  @Output() close: EventEmitter<
    ColumnOptionsDropdownComponent
  > = new EventEmitter();

    @ViewChild('columpOptionsDropdown', { static: false })
  columpOptionsDropdown: DropDownListComponent;

  public isPublicViewOpen = false;
  public margin = { horizontal: 192, vertical: 40 };
  private layoutChangeSubscription: Subscription;
  private previousLayout: Layout;

  constructor(
    logger: LoggerService,
    private columnOptionsService: ColumnOptionsService,
    userProfileService: UserprofileService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super('LayoutDropdownComponent', logger);
    this.viewModel = new SideNavViewModel(this.columnOptionsService.dataModel);
    this.viewModel.user = userProfileService.dataModel.user;
  }

  /**
   * Init the Column Options Dropdown.
   *
   */
  ngOnInit(): void {
    this.registerLayoutChangeSubscription();
    this.columpOptionsDropdown.loading = true;
    this.changeDetector.detectChanges();
    this.previousLayout = null;
  }

  /**
   * Once all the input parameters are available fetch the layouts.
   *
   * @param the changes object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      !FMPHelper.StringIsNullOrWhiteSpace(this.viewModel.user.ldapAlias) ||
      !FMPHelper.StringIsNullOrWhiteSpace(this.application)
    ) {
      this.columnOptionsService
        .getLayoutsByUserAndApp(this.viewModel.user.ldapAlias, this.application)
        .subscribe(response => {
          this.viewModel.LayoutsInContext = this.processUserLayouts(
            response.layouts,
          );
          let selectedLayout = this.viewModel.LayoutsInContext[0];
          if (response.activeLayouts && response.activeLayouts.activeLayoutID) {
            const foundLayout = this.viewModel.LayoutsInContext.find(
              l => l.layoutID === response.activeLayouts.activeLayoutID,
            );
            selectedLayout = foundLayout ? foundLayout : selectedLayout;
          }
          this.columpOptionsDropdown.loading = false;
          this.columnOptionsService.layoutChangeObservable.next(selectedLayout);
        });
    }
  }

  ngOnDestroy(): void {
    this.UnsubscribeObervable(this.layoutChangeSubscription);
  }

  trackPublicLayout(index: number, item: Layout) {
    return item.layoutID;
  }

  /**
   * When user changes the layout selection trigger the layout change observable.
   *
   * @param layout parameter
   */
  onLayoutChange(layout: Layout): void {
    this.columnOptionsService.layoutChangeObservable.next(layout);
  }

  /**
   * Event handler for the Dropdown open.
   *
   * @param event parameter
   */
  OpenHandler(event): void {
    this.open.emit(this);
  }

  /**
   * Event handler for the dropdown close.
   *
   * @param event parameter
   */
  CloseHandler(event): void {
    if (this.isPublicViewOpen) {
      // Close the public layout popover if it is open when the dropdown is closing.
      setTimeout(() => {
        this.isPublicViewOpen = false;
        this.changeDetector.detectChanges();
      }, 1500);
    }
    this.close.emit(this);
  }

  /**
   * Disable the seperator items added to te layout list.
   *
   * @param itemArgs parameters object
   * @returns boolean value whether the item is disabled
   */
  public itemDisabled(itemArgs: { dataItem: Layout; index: number }) {
    return itemArgs && itemArgs.dataItem
      ? itemArgs.dataItem.isSeperator
      : false;
  }

  /**
   * Toggle the public layout dropdown and fetch the data to populate the public layout list.
   *
   * @param the public layout flag
   */
  togglePublicLayout(flag?: boolean): void {
    this.isPublicViewOpen =
      flag === null || flag === undefined ? !this.isPublicViewOpen : flag;

    if (this.isPublicViewOpen) {
      this.columpOptionsDropdown.loading = this.isPublicViewOpen;
      this.columnOptionsService
        .getPublicLayoutsByUserAndApp(
          this.viewModel.user.ldapAlias,
          this.application,
        )
        .subscribe(
          response => {
            this.viewModel.PublicLayoutsInContext = this.sortLayouts(
              response.map(l => new Layout(l)),
            );
            this.columpOptionsDropdown.loading = false;
            // Detect changes as the Change Detection is detached as long as teh Dropdown is open.
            this.changeDetector.detectChanges();
          },
          error => {
            this.ToasterServiceInstace.ShowError(
              'Error while fetching Public Layouts.',
            );
            this.columpOptionsDropdown.loading = false;
            // Detect changes as the Change Detection is detached as long as teh Dropdown is open.
            this.changeDetector.detectChanges();
            this.WriteErrorLog('Error while fetching Public Layouts.', error);
          },
        );
    }

    this.changeDetector.detectChanges();
  }

  /**
   * Add/Remove the public layout from the favorite layout of the user.
   *
   * @param the event parameter
   * @param the layout parameter
   * @param the addToFavorite boolean parameter
   */
  onFavoriteClick(event, layout: Layout, addToFavorite: boolean) {
    event.preventDefault();
    event.stopPropagation();

    if (
      addToFavorite &&
      this.viewModel.usersPublicFavLayouts.length >=
        FMPConstant.ColumnOptions.maxAllowedPublicFavLayouts
    ) {
      this.ToasterServiceInstace.ShowError(
        FMPConstant.ColumnOptions.maxAllowedPublicFavLayoutMessage,
      );
    } else {
      if (
        !FMPHelper.StringEqual(layout.userID, this.viewModel.user.ldapAlias)
      ) {
        const patchJson: PatchJson = {
          path: 'FavoriteLayout',
          op: addToFavorite ? 'add' : 'remove',
          value: layout.layoutID.toString(),
        };

        this.columnOptionsService
          .patchUserLayoutPreferences(
            this.viewModel.user.ldapAlias,
            this.application,
            patchJson,
          )
          .subscribe(
            response => {
              if (addToFavorite) {
                if (response) {
                  this.viewModel.LayoutsInContext = this.processUserLayouts([
                    ...this.viewModel.LayoutsInContext,
                    layout,
                  ]);
                  LO.remove<Layout>(
                    this.viewModel.PublicLayoutsInContext,
                    lay => lay.layoutID === layout.layoutID,
                  );
                  this.columnOptionsService.layoutChangeObservable.next(layout);
                } else {
                  this.ToasterServiceInstace.ShowError(
                    'Failed to set Public Layout as favorite.',
                  );
                }
              } else {
                if (response) {
                  LO.remove<Layout>(
                    this.viewModel.LayoutsInContext,
                    lay => lay.layoutID === layout.layoutID,
                  );
                  this.viewModel.LayoutsInContext = this.processUserLayouts(
                    this.viewModel.LayoutsInContext,
                  );
                  this.viewModel.PublicLayoutsInContext = this.sortLayouts([
                    ...this.viewModel.PublicLayoutsInContext,
                    layout,
                  ]);
                  if (
                    this.viewModel.selectedLayout.layoutID === layout.layoutID
                  ) {
                    this.columnOptionsService.layoutChangeObservable.next(
                      this.viewModel.LayoutsInContext[0],
                    );
                  }
                } else {
                  this.ToasterServiceInstace.ShowError(
                    'Failed to remove Public Layout as favorite.',
                  );
                }
              }
              // Detect changes as the Change Detection is detached as long as teh Dropdown is open.
              this.changeDetector.detectChanges();
            },
            err => {
              this.WriteErrorLog(
                'Error while patch update for User Layout.',
                err,
              );
              this.ToasterServiceInstace.ShowError(
                'Error while updating Public Layout favorites.',
              );
            },
          );
      }
    }
  }

  /**
   * Update the layout preferences of the user with his last active layout.
   * @param layout - active layout
   */
  private updateActiveLayout(layout: Layout): void {
    const activeLayout: IActiveLayout = {
      activeLayoutID: layout.layoutID,
      applicationName: this.application,
      userID: this.viewModel.user.ldapAlias,
    };
    // Save the currently selected layout as active layout for user
    this.columnOptionsService
      .saveActiveLayout(activeLayout)
      .subscribe(
        res => {},
        error => this.WriteErrorLog('Error while saving active layout.', error),
      );
  }

  /**
   * Register the layout change subscription when ever the user changes his layout selection.
   * It emits the layout change event and resets the grid columns based on the selected layout.
   *
   */
  private registerLayoutChangeSubscription() {
    // This subscription is triggered when user changes the selected Layout
    // it rebinds the Groups, Filters and Sorting based on the selected layout
    this.layoutChangeSubscription = this.columnOptionsService.layoutChangeObservable.subscribe(
      lay => {
        this.WriteDebugLog(
          'ActivityMonitorComponent => layoutChangeSubscription triggered.',
        );
        if (lay) {
          this.viewModel.selectedLayout = lay;
          if (
            this.previousLayout == null ||
            this.previousLayout.layoutID !== lay.layoutID
          ) {
            this.gridModel.GroupSettings = lay.group ? lay.group.slice() : null;
            this.gridModel.SortSettings = lay.sort ? lay.sort.slice() : null;
            this.gridModel.FilterSettings = lay.filter
              ? FMPHelper.CloneJSONObject(lay.filter)
              : null;
          }
          this.change.emit(lay);
          // This method is used to manage grid columns and other grid settings based on the current layout
          this.resetColumnsOrderBasedonLayout();
          this.updateActiveLayout(lay);
          this.previousLayout = lay;
        }
      },
      error => this.WriteErrorLog('Error while changing layouts', error),
    );
  }

  /**
   * Segregates and Sorts the users layouts as per their type
   * Types: System, Public and Private.
   */
  private processUserLayouts(data: ILayout[]): Layout[] {
    data = data ? data : [];
    let layouts: Layout[] = data.map(il => new Layout(il));

    const systemLayouts = this.sortLayouts(
      layouts.filter(l =>
        FMPHelper.StringEqual(l.layoutType, LayoutTypes.System),
      ),
    );
    const privateLayouts = this.sortLayouts(
      layouts.filter(l =>
        FMPHelper.StringEqual(l.userID, this.viewModel.user.ldapAlias),
      ),
    );
    const favoritePublicLayouts = this.sortLayouts(
      layouts.filter(
        l =>
          FMPHelper.StringEqual(l.layoutType, LayoutTypes.Public) &&
          !FMPHelper.StringEqual(l.userID, this.viewModel.user.ldapAlias),
      ),
    );
    const separator = new Layout(null);
    separator.isSeperator = true;

    layouts = systemLayouts;
    layouts =
      favoritePublicLayouts && favoritePublicLayouts.length > 0
        ? [...layouts, separator, ...favoritePublicLayouts]
        : layouts;
    layouts =
      privateLayouts && privateLayouts.length > 0
        ? [...layouts, separator, ...privateLayouts]
        : layouts;
    return layouts;
  }

  /**
   * Sorts the array of layouts as per the name.
   */
  private sortLayouts(data: Layout[]): Layout[] {
    if (data && data.length > 0) {
      data = LO.sortBy<Layout>(data, l => l.layoutName);
      data.forEach(d => (d.isSeperator = false));
    }
    return data ? data : [];
  }

  /**
   * Resets the grid columns based on the columns in the layout selected.
   */
  private resetColumnsOrderBasedonLayout(): void {
    const newColumns: ColumnComponent[] = [];
    const lockFixedCols = this.viewModel.selectedLayout.layoutConfigs.some(
      c => c.isLocked,
    );
    // If atleast one column is locked then mark the fixed columns as locked
    if (this.fixedColumns && this.fixedColumns.length > 0) {
      this.fixedColumns.forEach(idx => {
        this.gridModel.columns[idx].locked = lockFixedCols;
        newColumns.push(this.gridModel.columns[idx]);
      });
    }
    this.viewModel.selectedLayout.layoutConfigs.forEach(lcol => {
      const columnFound: ColumnComponent = this.gridModel.columns.find(gcol =>
        FMPHelper.StringEqual(gcol.field, lcol.fieldName),
      );
      if (columnFound) {
        columnFound.locked = lcol.isLocked;
        columnFound.orderIndex = lcol.sequence;
        newColumns.push(columnFound);
      }
    });

    // bind the newly genreated list of columns to grid
    this.gridModel.DataGridInstance.columns.reset(newColumns);
    // Detect changes as the Change Detection is detached as long as teh Dropdown is open.
    this.changeDetector.detectChanges();
  }

  /**
   * Opens the Column Options panel.
   *
   */
  openColumOptionsPanel(event): void {
    this.WriteDebugLog('ActivityMonitorComponent => toOpenSideNavbar');
    this.viewModel.showColumnOptions = true;
    document.getElementById('myColumnOptions').style.width = '300px';
    this.columpOptionsDropdown.toggle(false);
    this.CloseHandler(event);
    this.viewModel.application = this.application;
    this.viewModel.panelHeader = this.getPanelHeaderName();
    this.viewModel.showColumnOptions = true;
    this.columnOptionsService.triggerLayoutChange(
      this.viewModel.selectedLayout,
    );
  }

  private getPanelHeaderName(): string {
    let headerName = '';
    switch (this.application) {
      case FMPConstant.activityMonitor:
        headerName = FMPConstant.activityMonitorPanel;
        break;
      case FMPConstant.planandSchedule:
        headerName = FMPConstant.planandSchedulePanel;
        break;
      case FMPConstant.workCenter:
        headerName = FMPConstant.workCenterPanel;
        break;
    }
    return headerName;
  }
}
