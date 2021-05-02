using System;
using System.Linq;
using JournalApi.Controllers;
using JournalApi.Services.Abstract;
using JournalApi.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Test
{    
    public class UserControllerTest
    {
        [Fact]
        public void ReturnsIndex()
        {
            Assert.Equal(1, 1);
        }
    }
}