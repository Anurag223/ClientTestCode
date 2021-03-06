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

using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using FMP.API.Infrastructure.Exceptions;
using FMP.Model.Common;
using FMP.Model.LayoutDataModel;
using FMP.Model.UserProfileDataModel;
using FMP.Service.Layout.Interface;
using FMP.Service.UserProfile.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FMP.API.Controllers
{
    /// <summary>
    /// Provides profile functions for users in the TLM Utils domain such as saving last application used,
    /// retrieving layouts(custom grid views), etc.
    /// </summary>
    [Authorize]
    [ApiVersion("1.0")]
    [Produces("application/json")]
    [ApiExplorerSettings(GroupName = "v1")]
    public class HistorianController : Controller
    {
        #region constructor

        public HistorianController(
            IUserProfileService userProfileService,
            ILayoutService layoutService)
        {
            _userProfileService = userProfileService;
            _layoutService = layoutService;
        }

        #endregion

  


        #region variables

        public string exceptionMessage = string.Empty;
        private readonly IUserProfileService _userProfileService;
        private readonly ILayoutService _layoutService;

        #endregion
    }
}