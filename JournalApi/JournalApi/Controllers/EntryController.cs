using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using JournalApi.Models;
using JournalApi.Services.Abstract;

namespace JournalApi.Controllers
{
    [Produces("application/json")]
    [Route("api/[Controller]")]
    public class EntryController : Controller
    {
        public class OverviewQuery
        {
            [Range(1, Int64.MaxValue)]
            public long UserId { get; set; }
        }
        private readonly IEntryService _entryService;

        public EntryController(IEntryService entryService) => _entryService = entryService;

        [HttpGet]
        [Route("~/api/Entries/overview")]
        public async Task<ActionResult<IEnumerable<EntryInfoDto>>> GetOverview([FromQuery, BindRequired]OverviewQuery query)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            return new OkObjectResult(await _entryService.GetEntryInfos(query.UserId));
        }

    }
}