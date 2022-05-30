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

using FMP.API.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Net;
using Serilog;
using FMP.Common;

namespace FMP.API.Infrastructure.Filters
{
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger _logger;
        public HttpGlobalExceptionFilter(ILogger logger)
        {
            _logger = logger;
        }
        public void OnException(ExceptionContext context)
        {
            var req = context.HttpContext.Request;
            _logger.Error(context.Exception, $"Exception while handling request for user {req.HttpContext.GetUserLDAP()}, Details :- {req.Scheme}://{req.Host}{req.Path}{req.QueryString}");

            var status = HttpStatusCode.InternalServerError;
            string message;

            var exceptionType = context.Exception.GetType();
            if (exceptionType == typeof(NullReferenceException))
            {
                message = "Unauthorized Access";
                status = HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(NotImplementedException))
            {
                message = "A server error occurred.";
                status = HttpStatusCode.NotImplemented;
            }
            else if (exceptionType == typeof(DomainException))
            {
                message = context.Exception.Message.ToString();
                status = HttpStatusCode.InternalServerError;
            }
            else
            {
                message = context.Exception.Message;
                status = HttpStatusCode.NotFound;
            }
            context.ExceptionHandled = true;

            var response = context.HttpContext.Response;
            response.StatusCode = (int)status;
            response.ContentType = "application/json";
            var err = JsonConvert.SerializeObject(new
            {
                Message = message ?? "empty",
                Source = context.Exception.Source ?? "empty",
                StackTrace = context.Exception.StackTrace ?? "empty",
                InnerException = Convert.ToString(context.Exception.InnerException) ?? "empty",
                Data = Convert.ToString(context.Exception.Data) ?? "empty",
                HelpLink = context.Exception.HelpLink ?? "empty",
                HResult = Convert.ToString(context.Exception.HResult) ?? "empty",
                StatusCode = (int)status

            });
            response.WriteAsync(err);
        }
    }
}