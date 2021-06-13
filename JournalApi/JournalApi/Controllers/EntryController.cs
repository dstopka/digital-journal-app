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
        private readonly IEntryService _entryService;
        private readonly IMapper _mapper;

        public class OverviewQuery
        {
            [Range(1, Int64.MaxValue)]
            public long UserId { get; set; }
        }
        public class TextQuery
        {
            public string? Date { get; set; }
            [Range(1, Int64.MaxValue)]
            public long UserId { get; set; }
        }
        
        public EntryController(IMapper mapper, IEntryService entryService)
        {
            _mapper = mapper;
            _entryService = entryService;
        }

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

        [HttpGet("dashboard/journal/(modal:entry)")]
        public async Task<ActionResult<Journal>> GetText([FromQuery, BindRequired]TextQuery query)
        {
            return new OkObjectResult(await _entryService.GetJournalByDateAndId(query.Date!, query.UserId));
        }

        [HttpPost]
        public async Task<IActionResult> SaveJournal([FromBody] Journal journal)
        {
            var newJournal = _mapper.Map<Journal>(journal);
            await _entryService.CreateJournal(newJournal);

            return StatusCode(201);
        }

    }
}