﻿#region Header

// Schlumberger Private
// Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
// authored and generated code (including the selection and arrangement of
// the source code base regardless of the authorship of individual files),
// but not including any copyright interest(s) owned by a third party
// related to source code or object code authored or generated by
// non-Schlumberger personnel.
// This source code includes Schlumberger confidential and/or proprietary
// information and may include Schlumberger trade secrets. Any use,
// disclosure and/or reproduction is prohibited unless authorized in
// writing.

#endregion

using System;
using Microsoft.AspNetCore.Hosting;

namespace FMP.Common
{
    public static class HostingEnvironmentExtensions
    {
        public static readonly string Local = nameof(Local);

        /// <summary>
        ///     Checks if the current hosting environment name is
        ///     <see cref="F:Microsoft.AspNetCore.Hosting.EnvironmentName.Development" />.
        /// </summary>
        /// <param name="hostingEnvironment">An instance of <see cref="T:Microsoft.AspNetCore.Hosting.IHostingEnvironment" />.</param>
        /// <returns>
        ///     True if the environment name is <see cref="F:Microsoft.AspNetCore.Hosting.EnvironmentName.Development" />,
        ///     otherwise false.
        /// </returns>
        public static bool IsLocal(this IHostingEnvironment hostingEnvironment)
        {
            if (hostingEnvironment == null)
                throw new ArgumentNullException(nameof(hostingEnvironment));
            return hostingEnvironment.IsEnvironment(Local);
        }
    }
}