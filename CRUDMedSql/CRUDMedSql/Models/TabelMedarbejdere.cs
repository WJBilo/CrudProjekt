using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace CRUDMedSql.Models
{
    public class TabelMedarbejdere
    {
        public int? MedarbejderId;
        public string Navn { get; set; }
        public string ByNavn { get; set; }
        public string Afdeling { get; set; }
    }
}
