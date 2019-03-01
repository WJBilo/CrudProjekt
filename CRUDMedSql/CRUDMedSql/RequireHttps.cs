using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace CRUDMedSql 
{
    // AuthorizationFilterAttribute klassen indeholder en metode kaldet "OnAuthorization", 
    // hvor vi kan ’inject’ en ny respons, hvis anmodningen (http-Request’et) ikke er udført med HTTPS.
    public class RequireHttps : AuthorizationFilterAttribute 
    {


        // Følgende metode har en parameter actionContext som provider os med adgang til dens request og response properties.  
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            // Hvis browser request ikke er issued med https protokol så redirect the request, så det benytter https
            if (actionContext.Request.RequestUri.Scheme != Uri.UriSchemeHttps)
            {
                // Her sætter vi respons beskeden, som vi gerne vil sende tilbage til klienten,
                // lig med http status koden 302, som indikere at den efterspurgte information er fundet. 
                actionContext.Response = actionContext.Request.CreateResponse(System.Net.HttpStatusCode.Found);
                // Her sætter vi indholdet af den respons besked, 
                // som vi gerne vil sende tilbage til klienten, 
                // lig med en ny instans af StringContent, og constructoren forsyner os
                // med en måde at skabe en HTML streng, som vi kan levere til klienten som beskedindhold. 
                actionContext.Response.Content = new StringContent("Benyt HTTPS i stedet for HTTP", Encoding.UTF8, "text/html"); // text/html gør at Content-typen ændres til html 

                // Her redirecter vi automatisk til https ved hjælp af UriBuilder klassen. 
                // Og vi bygger URI'en fra request objektet 
                UriBuilder uriBuilder = new UriBuilder(actionContext.Request.RequestUri);
                if (uriBuilder.Host.Equals("localhost"))
                {
                    // URI'en skal have https som scheme 
                    uriBuilder.Scheme = Uri.UriSchemeHttps;
                    uriBuilder.Port = 44390;
                    actionContext.Response.Headers.Location = uriBuilder.Uri;
                }
                else
                {
                    uriBuilder.Scheme = Uri.UriSchemeHttps;
                    uriBuilder.Port = 443;
                    actionContext.Response.Headers.Location = uriBuilder.Uri;
                }


            }
            else
            {
                base.OnAuthorization(actionContext);
            }

        }

    }
}







