using System.Threading.Tasks;
using BC = BCrypt.Net.BCrypt;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using JournalApi.Models;
using JournalApi.Services.Abstract;

namespace JournalApi.Controllers
{
    [Produces("application/json")]
    [Route("api/[Controller]")]
    public class AccountController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AccountController(IMapper mapper, IUserService userService) 
        {
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userForRegistrationDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isEmailFree = await _userService.IsEmailFree(userForRegistrationDto?.Email!);
            if(!isEmailFree)
            {
                return BadRequest("Email is linked with an existing account");
            }

            var user = _mapper.Map<User>(userForRegistrationDto);

            user!.UserId = await _userService.GetNextId();
            user.Password = BC.HashPassword(user.Password);
            await _userService.CreateUser(user);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto userForAuthentication)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetUser(userForAuthentication?.Email!);

            if(user == null || !BC.Verify(userForAuthentication?.Password!, user.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok();
        }
    }
}