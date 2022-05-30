﻿/// <summary>
/// Schlumberger Private
/// Copyright 2018 Schlumberger.All rights reserved in Schlumberger
/// authored and generated code(including the selection and arrangement of
/// the source code base regardless of the authorship of individual files),
/// but not including any copyright interest(s) owned by a third party
/// related to source code or object code authored or generated by
/// non-Schlumberger personnel.
/// This source code includes Schlumberger confidential and/or proprietary
/// information and may include Schlumberger trade secrets.Any use,
/// disclosure and/or reproduction is prohibited unless authorized in
/// writing.
/// </summary>

using FMP.Model;
using FMP.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using System.Threading.Tasks;
using FMP.Model.UserProfileDataModel;
using FMP.Repository.UserProfile.Interface;
using FMP.Model.LayoutDataModel;

namespace FMP.Repository.UserProfile
{
    public class UserProfileRepository : IUserProfileRepository
    {
        protected IFMPContext _context;
        public const string ActivityMonitor_SupplyView = "Supply View";

        public UserProfileRepository(IFMPContext context)
        {
            _context = context;
        }

        #region user profile fetch and Create
        /// <summary>
        /// This method will return Layout details for userID and applicationName
        /// </summary>
        /// <param name="LDAP"></param>
        /// <param name="applicationName"></param>
        /// <returns></returns>
        public async Task<ColumnOptionData> GetUserProfile(string LDAP, string applicationName)
        {
            #region Check if any Active UserProfile exists in UserProfile table 
            var userprofile = await _context.UserProfiles.Find(_ => true).ToListAsync();
            var profile = userprofile.Where(a => a.UserID == LDAP && a.IsActive == true).FirstOrDefault();
            #endregion


            var result = new ColumnOptionData();
            result.Layouts = new List<FMP.Model.LayoutDataModel.Layout>();

            if (profile == null) // No user profile present
            {
                profile = userprofile.Where(a => a.UserID == "SystemUser").FirstOrDefault();
                var layouts = await _context.Layouts.Find(_ => true).ToListAsync();

                // Return Default Layouts 
                result.Layouts.AddRange(layouts.Where(a => a.UserID == "SystemUser"
                && a.ApplicationName == applicationName).ToList().OrderBy(o => o.LayoutName));
            }
            else
            {
                profile = userprofile.Where(a => a.UserID == LDAP).FirstOrDefault();
                var layouts = await _context.Layouts.Find(_ => true).ToListAsync();

                // Try to get layout name
                result.Layouts.AddRange(layouts.Where(a => a.UserID == LDAP
                && a.ApplicationName == applicationName).ToList());

                // Add Default Layout Names
                var defaultLayout = layouts.Where(a => a.UserID == "SystemUser"
                          && a.ApplicationName == applicationName).ToList().OrderBy(o => o.LayoutName);
                result.Layouts.AddRange(defaultLayout);
            }

            #region Add ActiveLayout if exists
            var activeLayouts = await _context.UserLayoutPreferences.Find(_ => true).ToListAsync();
            var active = activeLayouts.Where(a => a.UserID == LDAP && a.ApplicationName == applicationName).FirstOrDefault();
            if (active == null) // set it some default layout
            {
                result.ActiveLayouts = new UserLayoutPreference();
                if (applicationName == "WorkCenter")
                {
                    result.ActiveLayouts.UserID = LDAP;
                    result.ActiveLayouts.ApplicationName = "WorkCenter";
                    result.ActiveLayouts.ActiveLayoutID = 1;
                }
                else if (applicationName == "ActivityMonitor")
                {
                    result.ActiveLayouts.UserID = LDAP;
                    result.ActiveLayouts.ApplicationName = "ActivityMonitor";
                    result.ActiveLayouts.ActiveLayoutID = result.Layouts.Where(s => s.LayoutName.ToLower() == ActivityMonitor_SupplyView.ToLower()).FirstOrDefault().LayoutID;
                }

                else
                {
                    result.ActiveLayouts.UserID = LDAP;
                    result.ActiveLayouts.ApplicationName = "PlanandSchedule";
                    result.ActiveLayouts.ActiveLayoutID = 3;
                }
            }
            else
            {
                result.ActiveLayouts = active;
            }

            #endregion
            return result;
        }


        public async Task<bool> SaveUserProfile(UserProfileRequestData userProfileRequestData)
        {
            #region check if UserProfile present
            var userprofile = await _context.UserProfiles.Find(_ => true).ToListAsync();
            var profile = userprofile.Where(a => a.UserID == userProfileRequestData.UserID && a.IsActive == true).FirstOrDefault();
            #endregion

            #region Save Custom Layout
            if (profile == null)
            {
                var maxValueProfileID = userprofile.Where(a => a.IsActive == true).Max(a => a.ProfileID) + 1;
                var userProfile = new FMP.Model.UserProfileDataModel.UserProfile
                {
                    _id = ObjectId.GenerateNewId(),
                    ProfileID = (Int32)maxValueProfileID,
                    IsActive = true,
                    UserID = userProfileRequestData.UserID,
                    FirstName = userProfileRequestData.FirstName,
                    LastName = userProfileRequestData.LastName,
                    CreationTimestamp = userProfileRequestData.CreationTimestamp,
                    LastUpdateTimestamp = userProfileRequestData.LastUpdateTimestamp
                };
                await _context.UserProfiles.InsertOneAsync(userProfile);

            }
            #endregion

            #region check if Layout present
            var layouts = await _context.Layouts.Find(_ => true).ToListAsync();
            var layout = layouts.Where(a => a.UserID == userProfileRequestData.UserID
            && a.ApplicationName == userProfileRequestData.LayoutData.ApplicationName
            && a.LayoutName == userProfileRequestData.LayoutData.LayoutName).FirstOrDefault();
            #endregion

            #region Save Custom Layout
            var maxValue = 0;
            if (layout == null)
            {
                maxValue = layouts.Max(a => a.LayoutID) + 1;
                var layoutItem = new FMP.Model.LayoutDataModel.Layout
                {
                    _id = ObjectId.GenerateNewId(),
                    LayoutID = maxValue,
                    UserID = userProfileRequestData.UserID,
                    ApplicationName = userProfileRequestData.LayoutData.ApplicationName,
                    LayoutName = userProfileRequestData.LayoutData.LayoutName,
                    LayoutConfigs = userProfileRequestData.LayoutData.LayoutConfigs,
                    Sort = userProfileRequestData.LayoutData.Sort,
                    Group = userProfileRequestData.LayoutData.Group,
                    Filter = userProfileRequestData.LayoutData.Filter
                };
                await _context.Layouts.InsertOneAsync(layoutItem);

            }
            else
            {
                var filter = Builders<FMP.Model.LayoutDataModel.Layout>.Filter.Where(
                        f => f.LayoutID == layout.LayoutID
                        );
                var updatestatement = Builders<FMP.Model.LayoutDataModel.Layout>.Update.Set(s => s.LayoutConfigs, userProfileRequestData.LayoutData.LayoutConfigs);
                UpdateResult actionResult = await _context.Layouts.UpdateOneAsync(filter, updatestatement);

                // Condition not required now as we have removed column option from Admin and integrated on PNS, Same as Activity Monitor
                //if (userProfileRequestData.LayoutData.ApplicationName == "ActivityMonitor" || userProfileRequestData.LayoutData.ApplicationName == "WorkCenter")
                //{
                    var updateSortStatement = Builders<FMP.Model.LayoutDataModel.Layout>.Update.Set(s => s.Sort, userProfileRequestData.LayoutData.Sort);
                    UpdateResult actionResultSort = await _context.Layouts.UpdateOneAsync(filter, updateSortStatement);

                    var updateGroupStatement = Builders<FMP.Model.LayoutDataModel.Layout>.Update.Set(s => s.Group, userProfileRequestData.LayoutData.Group);
                    UpdateResult actionResultGroup = await _context.Layouts.UpdateOneAsync(filter, updateGroupStatement);

                    var updateFilterStatement = Builders<FMP.Model.LayoutDataModel.Layout>.Update.Set(s => s.Filter, userProfileRequestData.LayoutData.Filter);
                    UpdateResult actionResultFilter = await _context.Layouts.UpdateOneAsync(filter, updateFilterStatement);
                //}

            }
            #endregion


            #region check if user preference present
            var activeLayouts = await _context.UserLayoutPreferences.Find(_ => true).ToListAsync();
            var activeLayout = activeLayouts.Where(a => a.UserID == userProfileRequestData.UserID
            && a.ApplicationName == userProfileRequestData.LayoutData.ApplicationName).FirstOrDefault();
            #endregion

            #region Save User Preference
            if (activeLayout == null)
            {
                var activeLayoutsItem = new FMP.Model.LayoutDataModel.UserLayoutPreference
                {
                    _id = ObjectId.GenerateNewId(),
                    UserID = userProfileRequestData.UserID,
                    ApplicationName = userProfileRequestData.LayoutData.ApplicationName,
                    ActiveLayoutID = maxValue
                };
                await _context.UserLayoutPreferences.InsertOneAsync(activeLayoutsItem);
            }
            else
            {
                if (maxValue == 0)
                {
                    maxValue = layout.LayoutID;
                }
                var filter = Builders<UserLayoutPreference>.Filter.Where(
                        f => f.UserID == userProfileRequestData.UserID &&
                        f.ApplicationName == userProfileRequestData.LayoutData.ApplicationName);
                var updatestatement = Builders<UserLayoutPreference>.Update.Set(s => s.ActiveLayoutID, maxValue);
                UpdateResult actionResult = await _context.UserLayoutPreferences.UpdateOneAsync(filter, updatestatement);
            }
            #endregion

            return true;
        }

        public async Task<bool> UpdateActiveLayout(UserActiveLayoutRequestData userActiveLayoutRequestData)
        {

            #region check if user preference present
            var activeLayouts = await _context.UserLayoutPreferences.Find(_ => true).ToListAsync();
            var activeLayout = activeLayouts.Where(a => a.UserID == userActiveLayoutRequestData.UserID
            && a.ApplicationName == userActiveLayoutRequestData.ApplicationName).FirstOrDefault();
            #endregion

            #region Save User Preference
            if (activeLayout == null)
            {
                var maxValue = _context.Layouts.Find(_ => true).ToList().Select(a => a.LayoutID).Max();
                var activeLayoutsItem = new FMP.Model.LayoutDataModel.UserLayoutPreference
                {
                    _id = ObjectId.GenerateNewId(),
                    UserID = userActiveLayoutRequestData.UserID,
                    ApplicationName = userActiveLayoutRequestData.ApplicationName,
                    ActiveLayoutID = userActiveLayoutRequestData.ActiveLayoutID
                };
                await _context.UserLayoutPreferences.InsertOneAsync(activeLayoutsItem);
                return true;
            }
            else
            {
                var filter = Builders<UserLayoutPreference>.Filter.Where(
                   f => f.UserID == userActiveLayoutRequestData.UserID &&
                   f.ApplicationName == userActiveLayoutRequestData.ApplicationName);
                var updatestatement = Builders<UserLayoutPreference>.Update.Set(s => s.ActiveLayoutID, userActiveLayoutRequestData.ActiveLayoutID);
                UpdateResult actionResult = await _context.UserLayoutPreferences.UpdateOneAsync(filter, updatestatement);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            #endregion

        }
        #endregion


        #region "Delete layout"
        public async Task<bool> RemoveLayout(int layoutId)
        {
            var layouts = await _context.Layouts.Find(_ => true).ToListAsync();
            var filter = Builders<FMP.Model.LayoutDataModel.Layout>.Filter.Where(f => f.LayoutID == layoutId);
            DeleteResult actionResult = await _context.Layouts.DeleteOneAsync(filter);
            return actionResult.IsAcknowledged && actionResult.DeletedCount > 0;
        }
        #endregion

        #region "Save Last Application Name"
        // This also creates a user profile if one does not exist.
        public async Task<bool> SaveLastApplicationName(string Ldap, string applicationName)
        {

            var userprofiles = await _context.UserProfiles.Find(_ => true).ToListAsync();

            //If user exists, update application name for the active profile
            if (userprofiles.Where(a => a.UserID == Ldap && a.IsActive == true).Any())
            {
                var filter = Builders<Model.UserProfileDataModel.UserProfile>.Filter.Where(
                      f => f.UserID == Ldap && f.IsActive == true);

                var updatestatement = Builders<Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.LastApplicationName, applicationName);
                UpdateResult actionResult = await _context.UserProfiles.UpdateOneAsync(filter, updatestatement);
                return actionResult.IsAcknowledged;
            }
            else // insert application name for user
            {
                Model.UserProfileDataModel.UserProfile profile = new Model.UserProfileDataModel.UserProfile();
                profile._id = ObjectId.GenerateNewId();
                profile.ProfileID = userprofiles.Any() ? this.GetMaxUserProfileId() : 1;
                profile.UserID = Ldap;
                profile.LastApplicationName = applicationName;
                profile.CreationTimestamp = DateTime.Now;
                profile.LastUpdateTimestamp = profile.CreationTimestamp;
                profile.IsActive = true;
                await _context.UserProfiles.InsertOneAsync(profile);
                return true;
            }
        }
        #endregion

        #region "Get Last Application Name"
        public async Task<string> GetLastApplicationName(string Ldap)
        {
            var userprofiles = await _context.UserProfiles.Find(_ => true).ToListAsync();
            return userprofiles.Where(a => a.UserID == Ldap && a.IsActive == true).Select(a => a.LastApplicationName).FirstOrDefault();
        }
        #endregion

        #region Get Max User ProfileId
        private int GetMaxUserProfileId()
        {
            int maxProfileId = _context.UserProfiles.Find(_ => true).ToList().Select(a => a.ProfileID).Max() + 1;
            return maxProfileId;
        }
        #endregion

        #region Get User Role and Locations
        public async Task<List<FMP.Model.UserProfileDataModel.UserProfile>> GetUserRoleLocation(string LDAP)
        {
            #region Check if any Active UserProfile exists in UserProfile table 
            var userprofile = await _context.UserProfiles.Find(_ => true).ToListAsync();
            var userpreferences =  userprofile.Where(a => a.UserID == LDAP).ToList();

            var usersList = _context.User.Find(_ => true).ToList();
            var userdetails = usersList.Where(u => u.Alias.ToLower() == LDAP.ToLower() && u.IsActive==true).FirstOrDefault();
            foreach (var item in userpreferences)
            {
                if (item.IsActive) {
                    item.IsAdmin = userdetails != null ? userdetails.IsAdmin : false ;
                    item.IsDeveloper = userdetails != null ? userdetails.IsDeveloper : false ;
                }
            }
            return userpreferences;
            #endregion
        }
        #endregion
        // This also creates profile if not exist
        #region Save / Update Role Location
        public async Task<bool> SaveUserRoleLocation(UserRoleLocationRequestData userRoleLocationRequestData)
        {
            var userprofile = _context.UserProfiles.Find(_ => true).ToList();

            var activeprofile = userprofile.Where(a => a.UserID == userRoleLocationRequestData.UserID && a.IsActive == true).FirstOrDefault();

            var profile = userprofile.Where(a => a.UserID == userRoleLocationRequestData.UserID
            && a.RoleName == userRoleLocationRequestData.RoleName).FirstOrDefault();

            #region update existing record IsActive False
            var filter = Builders<FMP.Model.UserProfileDataModel.UserProfile>.Filter.Where(
                       f => f.UserID == userRoleLocationRequestData.UserID && f.IsActive == true);

            var updatestatement = Builders<FMP.Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.IsActive, false);

            UpdateResult actionResult = await _context.UserProfiles.UpdateOneAsync(filter, updatestatement);
            #endregion

            #region Save User Role and Location
            var maxValueProfileID = userprofile.Where(a => a.IsActive == true).Max(a => a.ProfileID) + 1;
            if (profile == null)
            {
                var userProfile = new FMP.Model.UserProfileDataModel.UserProfile
                {
                    _id = ObjectId.GenerateNewId(),
                    ProfileID = (Int32)maxValueProfileID,
                    UserID = userRoleLocationRequestData.UserID,
                    FirstName = userRoleLocationRequestData.FirstName,
                    LastName = userRoleLocationRequestData.LastName,
                    LastApplicationName = activeprofile != null ? activeprofile.LastApplicationName : "",
                    RefreshInterval = activeprofile != null ? activeprofile.RefreshInterval : 0,
                    RoleName = userRoleLocationRequestData.RoleName,
                    ActiveLocations = userRoleLocationRequestData.ActiveLocations,
                    CreationTimestamp = DateTime.Now,
                    LastUpdateTimestamp = DateTime.Now,
                    IsActive = true
                };
                await _context.UserProfiles.InsertOneAsync(userProfile);
                return true;
            }
            else
            {
                var filterActiveLocations = Builders<FMP.Model.UserProfileDataModel.UserProfile>.Filter.Where(
                  f => f.UserID == profile.UserID && f.RoleName == profile.RoleName);

                var update = Builders<FMP.Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.ActiveLocations, userRoleLocationRequestData.ActiveLocations);
                UpdateResult result = await _context.UserProfiles.UpdateOneAsync(filterActiveLocations, update);

                var updateIsActive = Builders<FMP.Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.IsActive, true);
                UpdateResult updateIsActiveResult = await _context.UserProfiles.UpdateOneAsync(filterActiveLocations, updateIsActive);
                return true;
            }
            #endregion
        }
        #endregion

        #region "Save Page Refresh Interval specific to user"
        public async Task<bool> SaveRefreshIntervalInformation(string Ldap, string applicationName, int refreshInterval)
        {

            var userprofiles = await _context.UserProfiles.Find(_ => true).ToListAsync();

            //If user exists, update application name for the active profile
            if (userprofiles.Where(a => a.UserID == Ldap && a.IsActive == true).Any())
            {
                var filter = Builders<Model.UserProfileDataModel.UserProfile>.Filter.Where(
                      f => f.UserID == Ldap);

                var updatestatement = Builders<Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.RefreshInterval, refreshInterval);
                UpdateResult actionResult = await _context.UserProfiles.UpdateManyAsync(filter, updatestatement);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            else // insert application name for user
            {
                Model.UserProfileDataModel.UserProfile profile = new Model.UserProfileDataModel.UserProfile();
                profile._id = ObjectId.GenerateNewId();
                profile.ProfileID = GetMaxUserProfileId();
                profile.UserID = Ldap;
                profile.LastApplicationName = applicationName;
                profile.RefreshInterval = refreshInterval;
                profile.IsActive = true;
                await _context.UserProfiles.InsertOneAsync(profile);
                return true;
            }
        }
        #endregion

        #region Save User Preferences
        public async Task<bool> SaveUserPreference(FMP.Model.UserProfileDataModel.UserProfile profile)
        {
            var filter = Builders<Model.UserProfileDataModel.UserProfile>.Filter.Where(f => f.UserID == profile.UserID);
            var updatestatement = Builders<Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.SavedPreference, profile.SavedPreference);
            UpdateResult actionResult = await _context.UserProfiles.UpdateManyAsync(filter, updatestatement);

            return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
        }
        #endregion

        #region Save Release note Setting
        public async Task<bool> SaveReleaseNoteSetting(FMP.Model.UserProfileDataModel.UserJsonPatchReleaseNote userReleaseNote)
        {
            var filter = Builders<Model.UserProfileDataModel.UserProfile>.Filter.Where(f => f.UserID == userReleaseNote.ldapAlias);
            var updatestatement = Builders<Model.UserProfileDataModel.UserProfile>.Update.Set(s => s.LastReleaseNoteDismiss, Convert.ToInt32(userReleaseNote.patchJson.value));
            UpdateResult actionResult = await _context.UserProfiles.UpdateManyAsync(filter, updatestatement);

            return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
        }
        #endregion

        #region Update Column FieldName mappings in Mongo Database for Layouts
        public async Task<bool> UpdateDbLayoutColumnMappings(string appName, string fromColumn, string toColumn)
        {
            try
            {
                appName = string.IsNullOrWhiteSpace(appName) ? "ActivityMonitor" : appName;
                var userLayouts = await _context.Layouts.Find(s => s.ApplicationName == appName).ToListAsync();
                if (userLayouts != null)
                {
                    Dictionary<string, string> columnFields = new Dictionary<string, string>();
                    if (!string.IsNullOrWhiteSpace(fromColumn) && !string.IsNullOrWhiteSpace(toColumn))
                    {
                        columnFields.Add(fromColumn, toColumn);
                    }

                    columnFields.Add("movementDate", "plannedShipDate");
                    columnFields.Add("parentEquipmentRequest.tlmShipDate", "tlmShipDate");
                    columnFields.Add("parentEquipmentRequest.Priority.value", "priority");
                    columnFields.Add("parentEquipmentRequest.TCONumber", "tcoNumber");
                    columnFields.Add("parentEquipmentRequest.modifiedDate", "tcoModifiedDate");
                    columnFields.Add("parentEquipmentRequest.job.jobNumber", "jobNumber");
                    columnFields.Add("parentEquipmentRequest.job.client", "client");
                    columnFields.Add("parentEquipmentRequest.job.rig", "rig");
                    columnFields.Add("parentEquipmentRequest.job.well", "well");
                    columnFields.Add("name", "toolName");
                    columnFields.Add("status", "edoToolStatus");
                    columnFields.Add("EDOToolAssigned", "edoToolAssigned");
                    columnFields.Add("troNumber", "tro");
                    columnFields.Add("parentEquipmentRequest.version", "version");
                    columnFields.Add("parentEquipmentRequest.MaxBHStaticTempConverted", "maxBHStaticTempConverted");
                    columnFields.Add("parentEquipmentRequest.MaxBHCircTempConverted", "maxBHCircTempConverted");
                    columnFields.Add("parentEquipmentRequest.HighTemp.ParseValueBoolean", "highTemperature");
                    columnFields.Add("parentEquipmentRequest.HighPressure.ParseValueBoolean", "highPressure");
                    columnFields.Add("parentEquipmentRequest.HighDogleg.ParseValueBoolean", "highDogleg");
                    columnFields.Add("parentEquipmentRequest.CorrosiveEnvironment.ParseValueBoolean", "corrosiveEnvironment");
                    columnFields.Add("parentEquipmentRequest.HighShock.ParseValueBoolean", "highShock");
                    columnFields.Add("parentEquipmentRequest.comments", "tcoComments");
                    columnFields.Add("parentEquipmentRequest.ShippingInstructions.value", "shippingInstructions");
                    columnFields.Add("parentEquipmentRequest.MaintenanceOperations.value", "maintenanceOperations");
                    columnFields.Add("TCO_Report", "tcoReport");
                    columnFields.Add("requestedEquipmentBrand", "productGroup");
                    columnFields.Add("ProductGroupStatus", "productGroupStatus");
                    columnFields.Add("requestedEquipmentProductLine", "productLine");
                    columnFields.Add("ProductLineStatus", "productLineStatus");
                    columnFields.Add("parentEquipmentRequest.siteName", "siteName");
                    columnFields.Add("parentEquipmentRequest.job.wellSite", "businessSite");
                    columnFields.Add("equipmentDemandFulFillment.pcv", "pcv");
                    columnFields.Add("equipmentDemandFulFillment.movement.shipmentDate", "tlmActualShipDate");
                    columnFields.Add("equipmentDemandFulFillment.movement.shipmentNumber", "shipmentNumber");
                    columnFields.Add("redirectedType", "movementType");
                    columnFields.Add("Configuration", "configuration");
                    columnFields.Add("redirectedToSite", "redirectedTo");
                    columnFields.Add("Request_Type", "requestType");
                    columnFields.Add("Configuration_Compliance", "configurationCompliance");
                    columnFields.Add("parentEquipmentRequest.MaxBHPressureConverted", "maxBHPressureConverted");
                    columnFields.Add("nextMovementDate", "nextShipDate");
                    columnFields.Add("redirectedFromSite", "redirectedFrom");
                    columnFields.Add("Equipment_Availability", "equipmentAvailability");
                    columnFields.Add("parentEquipmentRequest.status", "tcoStatus");
                    columnFields.Add("parentEquipmentRequest.job.FSMDDDirectionDriller", "FSMDD");
                    columnFields.Add("parentEquipmentRequest.job.FSMMWDDeliveryManager", "FSMMWD");
                    columnFields.Add("parentEquipmentRequest.job.measurementDriller", "sdmCellName");
                    columnFields.Add("parentEquipmentRequest.job.FSMDEDrillerEngineer", "FSMDE");
                    columnFields.Add("Job_Status", "jobStatus");

                    //Iterate through all the layouts for AM
                    foreach (var layout in userLayouts)
                    {
                        // Check all the fields in Master Column list with the ones used in Current Layout
                        foreach (var field in columnFields)
                        {
                            // Update all the FieldNames in LayoutConfig - it refers columns
                            int columnCount = layout.LayoutConfigs.Count;
                            for (int i = 0; i < columnCount; i++)
                            {
                                if (layout.LayoutConfigs[i].FieldName == field.Key)
                                {
                                    layout.LayoutConfigs[i].FieldName = field.Value;
                                }
                            }
                            // Update all the Field in Sort - it refers Sort configs if stored
                            int sortCount = layout.Sort.Count;
                            for (int j = 0; j < sortCount; j++)
                            {
                                if (layout.Sort[j].field == field.Key)
                                {
                                    layout.Sort[j].field = field.Value;
                                }
                            }
                            // Update all the Field in Group - it refers Group configs if stored
                            int groupCount = layout.Group.Count;
                            for (int k = 0; k < groupCount; k++)
                            {
                                if (layout.Group[k].field == field.Key)
                                {
                                    layout.Group[k].field = field.Value;
                                }
                            }
                            // Update all the Field in Filters - it refers Filters configs if stored
                            int filterCount = layout.Filter.Filters.Count;
                            for (int h = 0; h < filterCount; h++)
                            {
                                if (layout.Filter.Filters[h].Field == field.Key)
                                {
                                    layout.Filter.Filters[h].Field = field.Value;
                                }
                                if (layout.Filter.Filters != null)
                                {
                                    this.UpdateFilterField(layout.Filter.Filters, field.Key, field.Value);
                                }
                            }
                            //Update the Layout
                            var layoutConfigs = Builders<FMP.Model.LayoutDataModel.Layout>.Filter.Where(s => s.ApplicationName == "ActivityMonitor" && s.LayoutID == layout.LayoutID);
                            var newFieldName = field.Value;
                            var updatestatement = Builders<FMP.Model.LayoutDataModel.Layout>.Update.Set(s => s.LayoutConfigs, layout.LayoutConfigs)
                                                                         .Set(s => s.Sort, layout.Sort)
                                                                         .Set(s => s.Group, layout.Group)
                                                                         .Set(s => s.Filter, layout.Filter);
                            UpdateResult actionResult = await _context.Layouts.UpdateOneAsync(layoutConfigs, updatestatement);
                            // return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
                        }
                    }
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("exception occured" + ex);
                return false;
            }
        }

        void UpdateFilterField(List<FiltersFields> filter, string oldFieldName, string newFieldName)
        {
            for (int i = 0; i < filter.Count; i++)
            {
                if (filter[i].Field == oldFieldName)
                {
                    filter[i].Field = newFieldName;
                }
                if (filter[i].Filters != null)
                {
                    this.UpdateFilterField(filter[i].Filters, oldFieldName, newFieldName);
                }
            }
        }
        #endregion
    }
}