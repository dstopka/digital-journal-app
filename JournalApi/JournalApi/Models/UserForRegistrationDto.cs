using System.ComponentModel.DataAnnotations;

namespace JournalApi.Models
{
    public class UserForRegistrationDto
    {
        [Required(ErrorMessage = "First name is required")]
        public string? FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public string? LastName { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [Required(ErrorMessage = "Password is required")]
        public string? Password {get; set;}

        [Compare("Password", ErrorMessage = "Passwords must be the same")]
        public string? PasswordConfirmation {get; set;}
    }
}