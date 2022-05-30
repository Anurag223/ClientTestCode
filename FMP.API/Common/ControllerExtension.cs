using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMP.API.Common
{
    public static class ControllerExtension
    {
        public static List<string> ErrorMessages(this ModelStateDictionary input)
        {
            var errors = new List<string>();
            foreach (var state in input)
            {
                foreach (var error in state.Value.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
            }

            return errors;
        }
    }
}
