using System.Threading.Tasks;
using System.Linq;
using BC = BCrypt.Net.BCrypt;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using JournalApi.Models;
using JournalApi.Services.Abstract;
using JournalApi.Responses;

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
            if (!ModelState.IsValid)
            {
                return BadRequest(new RegistrationResponseDto
                {
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage))
                });
            }

            var isEmailFree = await _userService.IsEmailFree(userForRegistrationDto?.Email!);
            if (!isEmailFree)
            {
                return BadRequest(new RegistrationResponseDto
                {
                    Errors = new string[] { "Email is linked with an existing account" }
                });
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
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage))
                });
            }

            var response = await _userService.Authenticate(userForAuthentication);

            if(!response.IsSuccessful)
            {
                return Unauthorized(response);
            }
            
            return Ok(response);
        }
    }
}