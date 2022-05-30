/* Schlumberger Private
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import { Pipe, PipeTransform } from '@angular/core';
import { GridGroupContext, GridConfigModel } from 'src/app/sharedcomponents/models/sharedmodels';
import { FMPHelper } from 'src/Constants/helpers';
import { LoggerService } from 'src/app/base/service/logger.service';

@Pipe({
  name: 'createGroupContext',
  pure: true
})
export class CreateGroupContextPipe implements PipeTransform {
  constructor(private loggerService: LoggerService) { }

  transform(value: any, gridModel: GridConfigModel, fullDateSet: any[]): GridGroupContext {
    // If group object already has a context return it instead of calculating again
    // Using JSON behaviour where it creates a property if not there to persist the Group Context within a group.
    if (!value.FMPGroupContext) {
      const groupContext = new GridGroupContext(value);
      try {
        if (value && fullDateSet) {
          if (gridModel && gridModel.GroupSettings && groupContext.GroupPageItems && groupContext.GroupPageItems.length > 0) {
            // Get the index position of the current group item.
            const groupIndex = gridModel.GroupSettings.findIndex(g => FMPHelper.StringEqual(g.field, value.field));
            // Store the current group setting details.
            groupContext.GroupDetails = gridModel.GroupSettings[groupIndex];
            // Find and save the Group setting details of the group and all its parents.
            groupContext.GroupHierarchy = gridModel.GroupSettings.slice(0, groupIndex + 1);
            // Initialize the temp data variable with all data.
            let tempGroupData = fullDateSet.slice();
            if (groupContext.GroupHierarchy && groupContext.GroupHierarchy.length > 0) {
              // Iterate through the Group Hierarchy narrowing the data down by filtering.
              for (const grpDetails of groupContext.GroupHierarchy) {
                // Extract the value from the first item in the page data.
                const groupvalue = FMPHelper.ExtractValueFromObject(groupContext.GroupPageItems[0], grpDetails.field);
                // Filter the data based on the value extracted.
                tempGroupData = tempGroupData.filter(item =>
                  FMPHelper.ObjectEqual(FMPHelper.ExtractValueFromObject(item, grpDetails.field), groupvalue));
              }
            }

            // If temp data is valid assign to all items else assign Group Page Items.
            groupContext.GroupAllItems = tempGroupData ? tempGroupData : groupContext.GroupPageItems;
          }
        }
      } catch (ex) {
        // Note: If there is an error in calculating all items. the All items will be equal to the Page Items.
        this.loggerService.WriteError('CreateGroupContextPipe', 'Error while calculating GroupAllItems', ex);
      }
      // Using JSON behaviour where it creates a property if not there to persist the Group Context within a group.
      value.FMPGroupContext = groupContext;
    }

    return value.FMPGroupContext;
  }
}