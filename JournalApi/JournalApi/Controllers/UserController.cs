using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using JournalApi.Models;
using JournalApi.Services.Abstract;

namespace JournalApi.Controllers
{
    [Produces("application/json")]
    [Route("api/[Controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService) => _userService = userService;

        [HttpGet]
        [Route("api/[Controller]s")]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            return new OkObjectResult(await _userService.GetAllUsers());
        }

    }
}