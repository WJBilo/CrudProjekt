using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CRUDMedSql
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
             
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { controller = "Medarbejder", action = "Index", id = RouteParameter.Optional }
            );  

            // Følgende sørger for at den rå json data som klienten modtager er ordentligt indented. 
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;

            // Gør sådan at serveren som standard formatere dataen i JSON-format 
            config.Formatters.JsonFormatter.SupportedMediaTypes
            .Add(new MediaTypeHeaderValue("text/html")); 

            // Https configuration

            // Følgende gør at man skal benytte https protokollen i hele Web api applikationen (For alle controllere og action methods). 
            config.Filters.Add(new RequireHttps());

            // Gør at man i hele Web api applikationen skal være logget ind, får at kunne udstede HTTP Requests til denne Rest service. 
            config.Filters.Add(new BasicAuthentication());      

            // Slår Cross origin sharing til som gør det muligt at sende http request afsted til denne Rest service på tværs af domæner.  .
            EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);    
        }
    }
}
 