using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Json;
using System.Linq;
using System.Threading.Tasks;

namespace CRUDMedSql.Models
{

public class MedarbejderDataAcces
    {

        private string connecString = "data source=DESKTOP-NFIKBHF\\SQLEXPRESS;initial catalog=Firma;integrated security=True;";

        public SqlDataReader GetDataFromDB(string command, SqlConnection con)
        {
            SqlCommand cmd = new SqlCommand(command, con);
            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            return reader; 
        }

        public int ExecNonQuery(string command, SqlConnection con)
        {
            SqlCommand cmd = new SqlCommand(command, con);
            con.Open();
            var returnedRows = cmd.ExecuteNonQuery();
            return returnedRows;
        } 

   
        // Hent specifik medarbejder
        public TabelMedarbejdere GetMedarbejderData(int id)
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {

                    TabelMedarbejdere medarb = new TabelMedarbejdere();
                    string SQLCommand = "Select * from tabelMedarbejdere WHERE MedarbejderID = @ID;";
                    SqlCommand cmd = new SqlCommand(SQLCommand, con);
                    // Følgende forhindrer SQL injections
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        medarb.MedarbejderId = (int)reader["MedarbejderId"];
                        medarb.Navn = reader["Navn"].ToString();
                        medarb.ByNavn = reader["ByNavn"].ToString();
                        medarb.Afdeling = reader["Afdeling"].ToString();
                    }

                    return medarb;

                }
                catch
                {

                    throw;
                }
            
            }
        }
        // Hent liste med byer
        public List<TabelByer> GetAlleByer()
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {
                    string SQLCommand = "Select * from tabelByer";
                    var SQLRdr = GetDataFromDB(SQLCommand, con);
                    List<TabelByer> byListe = new List<TabelByer>();
                    while (SQLRdr.Read())
                    {
                        TabelByer by = new TabelByer()
                        {
                            ByID = (int)SQLRdr["ByID"],
                            ByNavnet = SQLRdr["ByNavnet"].ToString(),
                        };
                        byListe.Add(by);
                    }

                    return byListe;

                }
                catch
                {

                    throw;
                }
             
            }

        }
        // Slet medarbejder
        public int DeleteMedarbejder(int id)
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {

                    
                    string SQLCommand = "Delete from tabelMedarbejdere where MedarbejderID = @ID;";
                    SqlCommand cmd = new SqlCommand(SQLCommand, con);
                    cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;
                    con.Open();
                    try
                    {
                        
                        cmd.ExecuteNonQuery();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }



                    return 1;
                }
                catch
                {

                    throw;
                }
            }
        }

        // Opdater medarbejder
        public int UpdateMedarbejder(TabelMedarbejdere medarbejder)
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {



                    string SQLCommand = "UPDATE tabelMedarbejdere SET Navn = @navn, ByNavn = @bynavn, Afdeling = @afdeling "
            + "WHERE MedarbejderId = @ID;";


                    SqlCommand command = new SqlCommand(SQLCommand, con);
                    // Følgende forhindrer SQL injections
                    command.Parameters.Add("@ID", SqlDbType.Int).Value = medarbejder.MedarbejderId;

                    command.Parameters.Add("@navn", SqlDbType.VarChar, 20).Value = medarbejder.Navn;

                    command.Parameters.Add("@bynavn", SqlDbType.VarChar, 20).Value = medarbejder.ByNavn;

                    command.Parameters.Add("@afdeling", SqlDbType.VarChar, 20).Value = medarbejder.Afdeling;

                    try
                    {
                        con.Open();
                        command.ExecuteNonQuery();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }



                    return 1;
                }
                catch
                {

                    throw;
                }
          

            }

        }







        // Skab en medarbejder
        public int CreateMedarbejder(TabelMedarbejdere medarbejder)
        {
            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {



                    string SQLCommand = "INSERT INTO tabelMedarbejdere (Navn, ByNavn, Afdeling) VALUES (@navn, @bynavn, @afdeling);";


                    SqlCommand command = new SqlCommand(SQLCommand, con);


                    command.Parameters.Add("@navn", SqlDbType.VarChar, 20).Value = medarbejder.Navn;

                    command.Parameters.Add("@bynavn", SqlDbType.VarChar, 20).Value = medarbejder.ByNavn;

                    command.Parameters.Add("@afdeling", SqlDbType.VarChar, 20).Value = medarbejder.Afdeling;

                    try
                    {
                        con.Open();
                        command.ExecuteNonQuery();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }



                    return 1;
                }
                catch
                {

                    throw;
                }
           

            }

        }

      

        // hent liste med medarbejdere
        public Tuple<List<TabelMedarbejdere>, int> GetMedarbejderPage(int pageNum, string navn, string byNavn, int rowsPerPage)
        {

            using (SqlConnection con = new SqlConnection(connecString))
            {
                try
                {
                    pageNum = pageNum - 1;
                    string SQLCommand = "";
                    if (navn == "" || navn == null)
                    {
                        if (byNavn == "" || byNavn == null)
                        {
                            SQLCommand = "select count(*) from tabelMedarbejdere; SELECT * FROM tabelMedarbejdere ORDER BY MedarbejderID OFFSET @amountToExclude ROWS FETCH NEXT @rowsPerPage ROWS ONLY;";
                        }
                        else
                        {
                            SQLCommand = "select count(*) from tabelMedarbejdere where ByNavn like '%' + @bynavn + '%'; select * from tabelMedarbejdere where ByNavn like '%' + @bynavn + '%' ORDER BY MedarbejderID OFFSET @amountToExclude ROWS FETCH NEXT @rowsPerPage ROWS ONLY;";

                        }

                    }
                    else
                    {
                        if (byNavn == "" || byNavn == null)
                        {
                            SQLCommand = "select count(*) from tabelMedarbejdere where Navn like '%' + @navn + '%'; select * from tabelMedarbejdere where Navn like '%' + @navn + '%' ORDER BY MedarbejderID OFFSET @amountToExclude ROWS FETCH NEXT @rowsPerPage ROWS ONLY;";

                        }
                        else
                        {
                            SQLCommand = "select count(*) from tabelMedarbejdere where Navn like '%' + @navn + '%' AND ByNavn like '%' + @bynavn + '%'; select * from tabelMedarbejdere where Navn like '%' + @navn + '%' AND ByNavn like '%' + @bynavn + '%' ORDER BY MedarbejderID OFFSET @amountToExclude ROWS FETCH NEXT @rowsPerPage ROWS ONLY;";

                        }

                    }

                    SqlCommand cmd = new SqlCommand(SQLCommand, con);
                    cmd.Parameters.Add("@amountToExclude", SqlDbType.Int).Value = pageNum * rowsPerPage; 
                    cmd.Parameters.Add("@navn", SqlDbType.VarChar).Value = navn;
                    cmd.Parameters.Add("@bynavn", SqlDbType.VarChar).Value = byNavn;
                    cmd.Parameters.Add("@rowsPerPage", SqlDbType.Int).Value = rowsPerPage; 
                    
                    con.Open();
                    SqlDataReader SQLRdr = cmd.ExecuteReader();

                    List<TabelMedarbejdere> result = new List<TabelMedarbejdere>();
                    int AmountOfRows = 0;
                    while (SQLRdr.Read())
                    {
                         
                        AmountOfRows = (int)SQLRdr[""];

                        if (SQLRdr.NextResult())
                        {
                            while (SQLRdr.Read())
                            {
                                TabelMedarbejdere medarb = new TabelMedarbejdere()
                                {
                                    MedarbejderId = (int)SQLRdr["MedarbejderId"],
                                    Navn = SQLRdr["Navn"].ToString(),
                                    ByNavn = SQLRdr["ByNavn"].ToString(),
                                    Afdeling = SQLRdr["Afdeling"].ToString()
                                };
                                result.Add(medarb);

                            }

                        }


                    }

                    return Tuple.Create(result, AmountOfRows);

                }
                catch
                {

                    throw;
                }
            

            }



        } 

        

    }
   
}



 