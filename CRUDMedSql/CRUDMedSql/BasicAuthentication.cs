using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace CRUDMedSql
{
    public class BasicAuthentication : AuthorizationFilterAttribute
    {
        // her overrider vi en method som er i AuthorizationFilterAttribute base klassen.
        // Vi bruger "actionContext" objektet som parameterværdi i OnAuthorization metoden.
        // Vi benytter dette objekt for at få fat i dens request and response properties.
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            // Autentificeringsoplysningerne er i headeren af http-request’et
            // Hvis følgende == null så har brugeren ikke sendt de rigtige credentials. 
            // Og så vil vi sende en unauthorized HTTP Response message. 

            if (actionContext.Request.Headers.Authorization == null)
            {
                // Sætter responsen som vi vil sende tilbage til klienten lig med http status koden 401
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            }
            else
            {
                // Det første vi vil gøre i vores else statement, er at sætter klientens credentials lig med en string.
                // authenticationToken kommer til at være base 64 encoded 
                string authenticationToken = actionContext.Request.Headers.Authorization.Parameter;
                // Her decoder vi authenticationToken 
                // Får at få fat  i den decodede string skal vi benytte Encoding klassen og gøre følgende. 
                // Dette konvertere den base-64-enkodede string, om til et 8-bit integer array.
                // Jeg benytter så GetString metoden fra Encoding klassen til at decode alle de specificerede bytes i dette int array, om til en string.
                string decodedAuthenticationToken = Encoding.UTF8.GetString(Convert.FromBase64String(authenticationToken));

                // Selve vores authenticationToken ser sådan her ud: username:password, når den er decoded
                // Så vi skal splitte den ved kolon 
                // Følgende komemer til at retunere et string array der kommer til at indeholde [0]brugernavnet og [1]passwordet. 
                string[] usernamePasswordArray = decodedAuthenticationToken.Split(':');
                string brugernavn = usernamePasswordArray[0];
                string password = usernamePasswordArray[1];


                // Her checker vi om brugeren har rettighed til at tilgå resursen
                // Hvis følgende ikke er true har han ikke adgang, hvis det dog er true
                // så har han lov til at passere og dette filter står ikke i vejen.
                if (!ElevSecurity.Login(brugernavn, password))
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                }

            }
        }
    }
}