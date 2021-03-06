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

using FMP.Model.UserDataModel;
using FMP.Repository.Counter.Interface;
using FMP.Repository.User.Interface;
using FMP.Service.User.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace FMP.Service.User
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICounterRepository _counterRepository;


        public UserService(IUserRepository userRepository, ICounterRepository counterRepository
           )
        {
            _userRepository = userRepository;
            _counterRepository = counterRepository;
        }

        /// <summary>
        /// Get Users List 
        /// </summary>
        /// <returns></returns>
        public async Task<List<Model.UserDataModel.User>> GetUsers()
        {
            return await _userRepository.GetUsers();
        }

        /// <summary>
        /// Create User
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<int> CreateUser(Model.UserDataModel.User user)
        {
            if (_userRepository.IsUserExists(user.GIN))
            {
                return -1;
            }
            else
            {
                // user.ID = await _counterRepository.GetNextUserID();
                user.IsActive = true;
                return await _userRepository.InsertUser(user);
            }
        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> UpdateUser(Model.UserDataModel.User user)
        {
            return await _userRepository.UpdateUser(user);
        }

        /// <summary>
        /// Delete User
        /// </summary>
        /// <param name="gin"></param>
        /// <returns></returns>
        public async Task<bool> DeleteUser(int gin)
        {
            return await _userRepository.DeleteUserByID(gin);
        }

    }
}
