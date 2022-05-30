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

using System.Collections.Generic;
using FMP.Model.LayoutDataModel;
using FMP.Repository.UserProfile;
using FMP.Repository.UserProfile.Interface;
using FMP.Service.UserProfile.Interface;
using Microsoft.Extensions.DependencyInjection;
using FMPUserProfile = FMP.Model.UserProfileDataModel.UserProfile;

namespace FMP.Service.UserProfile
{
    public static class UserProfileServicesModule
    {
        public static void Register(IServiceCollection services)
        {
            services.AddSingleton<IUserProfileRepository, UserProfileRepository>();
            services.AddTransient<IUserProfileService, UserProfileService>();

            services.AddTransient<IMongoDbCollection<FMPUserProfile>, MongoDbCollection<FMPUserProfile>>();
            services.AddTransient<IMongoDbCollection<UserLayoutPreference>, MongoDbCollection<UserLayoutPreference>>();

            services.AddTransient<IKeyGenerator<FMPUserProfile>, UserProfileKeyGenerator>();
            services.AddTransient<IKeyGenerator<UserLayoutPreference>, EmptyKeyGenerator<UserLayoutPreference>>();
            services.AddTransient<IQueryHandler<IQuery<FMPUserProfile>, FMPUserProfile>
                , GetHandler<FMPUserProfile>>();
            services.AddTransient<IQueryHandler<IQuery<FMPUserProfile>, bool>
                , EntityExists<FMPUserProfile>>();

            services.AddTransient<IQueryHandler<IQuery<UserLayoutPreference>, UserLayoutPreference>
                , GetHandler<UserLayoutPreference>>();

            services
                .AddTransient<ICommandHandler<ICreateCommand<FMPUserProfile>>, CreateEntityHandler<FMPUserProfile>>();

            services
                .AddTransient<ICommandHandler<ICreateCommand<UserLayoutPreference>>,
                    CreateEntityHandler<UserLayoutPreference>>();

            services
                .AddTransient<ICommandHandler<IUpdateCommand<UserLayoutPreference>>,
                    UpdateEntityHandler<UserLayoutPreference>>();

            services
                .AddTransient<ICommandHandler<IUpdateCommand<FMPUserProfile>>, UpdateEntityHandler<FMPUserProfile>>();

            services
                .AddTransient<IQueryHandler<IQuery<FMPUserProfile>, IReadOnlyList<FMPUserProfile>>,
                    GetCollectionHandler<FMPUserProfile>>();
            //services.AddTransient<ICommandHandler<IUpdateCollCommand<FMPUserProfile>>, UpdateEntityCollection<FMPUserProfile>>();
        }
    }
}