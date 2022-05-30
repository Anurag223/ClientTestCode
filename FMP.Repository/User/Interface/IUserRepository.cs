﻿/// Schlumberger Private
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

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace FMP.Repository.User.Interface
{
    public interface IUserRepository
    {
        /// <summary>
        /// Get users
        /// </summary>
        /// <returns></returns>
        Task<List<FMP.Model.UserDataModel.User>> GetUsers();

        /// <summary>
        /// Insert user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<int> InsertUser(FMP.Model.UserDataModel.User user);

        /// <summary>
        /// Update user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<bool> UpdateUser(FMP.Model.UserDataModel.User user);

        /// <summary>
        /// Delete user
        /// </summary>
        /// <param name="gin"></param>
        /// <returns></returns>
        Task<bool> DeleteUserByID(int gin);

        /// <summary>
        /// Check if Gin Number exists
        /// </summary>
        /// <param name="gin"></param>
        /// <returns></returns>
        bool IsUserExists(int gin);
    }
}
