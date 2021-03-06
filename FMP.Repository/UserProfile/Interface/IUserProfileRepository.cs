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

using FMP.Model.UserProfileDataModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FMP.Repository.UserProfile.Interface
{
    public interface IUserProfileRepository
    {
        Task<ColumnOptionData> GetUserProfile(string LDAP, string applicationName);

        Task<bool> SaveUserProfile(UserProfileRequestData userProfileRequestData);

        Task<bool> SaveLastApplicationName(string Ldap, string applicationName);

        Task<string> GetLastApplicationName(string Ldap);

        Task<bool> RemoveLayout(int layoutId);

        Task<bool> UpdateActiveLayout(UserActiveLayoutRequestData userActiveLayoutRequestData);

        Task<List<FMP.Model.UserProfileDataModel.UserProfile>> GetUserRoleLocation(string LDAP);

        Task<bool> SaveUserRoleLocation(UserRoleLocationRequestData userRoleLocationRequestData);

        Task<bool> SaveRefreshIntervalInformation(string Ldap, string applicationName, int refreshInterval);
        Task<bool> SaveUserPreference(FMP.Model.UserProfileDataModel.UserProfile profile);

        Task<bool> UpdateDbLayoutColumnMappings(string appName, string fromColumn, string toColumn);
        Task<bool> SaveReleaseNoteSetting(FMP.Model.UserProfileDataModel.UserJsonPatchReleaseNote userReleaseNote);
    }
}
