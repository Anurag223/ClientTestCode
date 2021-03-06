#region Header

/// <summary>
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

#endregion

#pragma warning disable 1591

using FMP.Model.UserProfileDataModel;
using System;
using FMPUserProfile = FMP.Model.UserProfileDataModel.UserProfile;

namespace FMP.Service.UserProfile
{

    public class UpdateUserProfilesCommand : UpdateBase<FMPUserProfile>
    {
        private UpdateUserProfilesCommand()
        {
        }
        public static UpdateUserProfilesCommand WithFilter(IQuery<FMPUserProfile> filter)
        {
            var obj = new UpdateUserProfilesCommand();
            obj.FilterInt = filter;
            return obj;
        }

        public UpdateUserProfilesCommand UpdateMany()
        {
            IsManyUpdate = true;
            return this;
        }

        public UpdateUserProfilesCommand SetPreference(UserPreference preference)
        {
            Updates.Add(UpdateBuilder.Set(s => s.SavedPreference, preference));
            return this;
        }

        public UpdateUserProfilesCommand SetLastReleaseNoteDismiss(long lastReleaseNoteDismiss)
        {
            Updates.Add(UpdateBuilder.Set(s => s.LastReleaseNoteDismiss, lastReleaseNoteDismiss));
            return this;
        }

        public UpdateUserProfilesCommand SetRefreshInterval(int refreshInterval)
        {
            Updates.Add(UpdateBuilder.Set(s => s.RefreshInterval, refreshInterval));
            return this;
        }

        public UpdateUserProfilesCommand SetAppName(string applicationName)
        {
            Updates.Add(UpdateBuilder.Set(s => s.LastApplicationName, applicationName));
            return this;
        }

        public UpdateUserProfilesCommand SetActive(bool isActive)
        {
            Updates.Add(UpdateBuilder.Set(s => s.IsActive, isActive));
            return this;
        }

        public UpdateUserProfilesCommand SetActiveLocations(string activeLocations)
        {
            Updates.Add(UpdateBuilder.Set(s => s.ActiveLocations, activeLocations));
            return this;
        }
        public UpdateUserProfilesCommand SetRoleName(string roleName)
        {
            Updates.Add(UpdateBuilder.Set(s => s.RoleName, roleName));
            return this;
        }
        public UpdateUserProfilesCommand SetCreationTimestamp(DateTime timestamp)
        {
            Updates.Add(UpdateBuilder.Set(s => s.CreationTimestamp, timestamp));
            return this;
        }
        public UpdateUserProfilesCommand SetLastUpdateTimestamp(DateTime timestamp)
        {
            Updates.Add(UpdateBuilder.Set(s => s.LastUpdateTimestamp, timestamp));
            return this;
        }
    }
}