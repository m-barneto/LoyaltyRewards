using LoyaltyRewardsAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LoyaltyRewardsAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MemberFlagsController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        public MemberFlagsController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }


    }
}
