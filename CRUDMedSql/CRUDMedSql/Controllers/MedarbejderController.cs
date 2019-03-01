using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Json;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using CRUDMedSql.Models;

namespace CRUDCoreSQL.Controllers
{
    
    public class MedarbejderController : ApiController
    {
        MedarbejderDataAcces objMedarb = new MedarbejderDataAcces();

   
        [HttpGet]
        public Tuple<List<TabelMedarbejdere>, int> Index(int page=1, string navn ="", string byNavn ="", int rowsPerPage = 10)
        {
            return objMedarb.GetMedarbejderPage(page, navn, byNavn, rowsPerPage);
        }
         
        [HttpGet]
        [Route("api/Medarbejder/ByDetaljer")] 
        public List<TabelByer> ByDetaljer()
        {
            return objMedarb.GetAlleByer(); 
        }
         
        [HttpDelete]
        [Route("api/Medarbejder/Delete/{id}")]
        public int Delete(int id)
        {
            return objMedarb.DeleteMedarbejder(id);
        }

        [HttpGet]
        [Route("api/Medarbejder/Detaljer/{id}")]
        public TabelMedarbejdere Detaljer(int id)
        {
            return objMedarb.GetMedarbejderData(id);
        }

        [HttpPut]
        [Route("api/Medarbejder/Update")]
        public int Update([FromBody] TabelMedarbejdere medarb) 
        { 
            return objMedarb.UpdateMedarbejder(medarb);
        }

        [HttpPost]
        [Route("api/Medarbejder/Create")]
        public int Create([FromBody] TabelMedarbejdere medarb)
        {
            return objMedarb.CreateMedarbejder(medarb);
        }

       

        [HttpGet]
        [Route("api/Medarbejder/AccesGranted")]
        public string AccesGranted()
        {
            return "Du har adgang";
        }



    }
}