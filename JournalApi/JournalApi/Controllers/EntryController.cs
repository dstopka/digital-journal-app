using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoMapper;

using JournalApi.Models;
using JournalApi.Responses;
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
        public class EntryQuery
        {
            [Required(ErrorMessage = "Date is required")]
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

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<JournalEntry>> GetEntry([FromQuery, BindRequired]EntryQuery query)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            return new OkObjectResult(await _entryService.GetEntryByDateAndId(query.Date!, query.UserId));
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> CreateEntry([FromBody]JournalEntryDto entryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new CreateEntryResponseDto
                {
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage))
                });
            }

            var newEntry = _mapper.Map<JournalEntry>(entryDto);
            await _entryService.CreateEntry(newEntry);

            return StatusCode(201);
        }

        [HttpPut]
        [Route("")]
        public async Task<IActionResult> UpdateEntry([FromBody]JournalEntryDto entryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new CreateEntryResponseDto
                {
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage))
                });
            }

            var updatedEntry = _mapper.Map<JournalEntry>(entryDto);
            await _entryService.UpdateEntry(updatedEntry);

            return StatusCode(200);
        }

        [HttpDelete]
        [Route("")]
        public async Task<IActionResult> DeleteEntry([FromQuery, BindRequired]EntryQuery query) 
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            await _entryService.DeleteEntry(query.Date!, query.UserId);

            return StatusCode(200);
        }

    }
}