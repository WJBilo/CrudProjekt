using CRUDMedSql.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CRUDMedSql
{
    public class ElevSecurity
    {
        private static string connecString = "data source=DESKTOP-NFIKBHF\\SQLEXPRESS;initial catalog=Firma;integrated security=True;";

        // Denne metode kommer til at returnere true eller false, alt efter om det angivende brugernavn og kodeord, er gyldig.  
        public static bool Login(string brugernavn, string kodeord)
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                string SQLCommand = "SELECT COUNT(*) from tabelAdmins where Brugernavn = @username AND Kodeord = @password";

                SqlCommand cmd = new SqlCommand(SQLCommand, con);

                con.Open();
                cmd.Parameters.Add("@username", SqlDbType.VarChar).Value = brugernavn;
                cmd.Parameters.Add("@password", SqlDbType.VarChar).Value = kodeord;
                int userCount = (int)cmd.ExecuteScalar(); 


                if (userCount > 0)
                {
                    return true;
                }
                else
                {
                    return false; 
                }
    
            }
        }
    }
}