﻿#region Header

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

using MongoDB.Driver;
using FMPUserProfile = FMP.Model.UserProfileDataModel.UserProfile;

namespace FMP.Service.UserProfile
{
    public class UserProfileKeyGenerator: KeyGenerator<FMPUserProfile>
    {
        public UserProfileKeyGenerator(IMongoDbCollection<FMPUserProfile> collection)
            : base(collection)
        {
        }

        protected override void SetID(FMPUserProfile maxEntity, FMPUserProfile newEntity)
        {
            if (maxEntity == null) newEntity.ProfileID = 1;
            else newEntity.ProfileID = maxEntity.ProfileID + 1;
        }

        protected override SortDefinition<FMPUserProfile> Sort()
        {
            return Builders<FMPUserProfile>.Sort.Descending(o => o.ProfileID);
        }
    }

}