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
using FMP.Model.Common;
using FMP.Repository.Interface;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FMP.Repository.Context
{
    /// <summary>
    /// FMP Database Context
    /// </summary>
    public class FMPContext: IFMPContext
    {
        private readonly IMongoDatabase _database = null;
        /// <summary>
        /// FMP Database Initialization
        /// </summary>
        /// <param name="settings"></param>
        public FMPContext(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.Database);
        }
        /// <summary>
        /// Stores the next primary key for the record to be inserted
        /// </summary>
        public IMongoCollection<FMP.Model.CounterDataModel.Counter> Counter => _database.GetCollection<FMP.Model.CounterDataModel.Counter>("Counter");

        /// <summary>
        /// Stores user profile information (Current/selected role,site,unit for conversion)
        /// </summary>
        public IMongoCollection<FMP.Model.UserProfileDataModel.UserProfile> UserProfiles => _database.GetCollection<FMP.Model.UserProfileDataModel.UserProfile>("UserProfile");
        /// <summary>
        /// Stores Grid Layouts
        /// </summary>
        public IMongoCollection<FMP.Model.LayoutDataModel.Layout> Layouts => _database.GetCollection<FMP.Model.LayoutDataModel.Layout>("Layout");
        /// <summary>
        /// Stores active layout
        /// </summary>
        public IMongoCollection<FMP.Model.LayoutDataModel.UserLayoutPreference> UserLayoutPreferences => _database.GetCollection<FMP.Model.LayoutDataModel.UserLayoutPreference>("UserLayoutPreference");


        /// <summary>
        /// Stores user information
        /// </summary>
        public IMongoCollection<FMP.Model.UserDataModel.User> User => _database.GetCollection<FMP.Model.UserDataModel.User>("Users");
        /// <summary>
        /// Stores FMP roles
        /// </summary>
        public IMongoCollection<FMP.Model.RoleDataModel.Role> Role => _database.GetCollection<FMP.Model.RoleDataModel.Role>("FMPRole");
        /// <summary>
        /// Stores permissions for FMP role
        /// </summary>
        public IMongoCollection<FMP.Model.RoleDataModel.Claim> Claim => _database.GetCollection<FMP.Model.RoleDataModel.Claim>("RolePermissions");
        /// <summary>
        /// Stores CMMS Roles information
        /// </summary>
        public IMongoCollection<FMP.Model.RoleDataModel.CMMSRole> CMMSRole => _database.GetCollection<FMP.Model.RoleDataModel.CMMSRole>("CMMSRole");


        /// <summary>
        /// Stores releaseNote
        /// </summary>
        public IMongoCollection<ReleaseNoteModel> ReleaseNote => _database.GetCollection<ReleaseNoteModel>("ReleaseNotes");
       
    }
}
