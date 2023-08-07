using LoyaltyRewardsAPI.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;

namespace LoyaltyRewardsAPI.Data {
    public class AppDatabase : DbContext {

        public AppDatabase(DbContextOptions<AppDatabase> options) : base(options) { }

        public DbSet<Member> Members => Set<Member>();
        public DbSet<Transaction> Transactions => Set<Transaction>();

        protected override void OnConfiguring(DbContextOptionsBuilder options) {
            options.UseSqlite(options => {
                options.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            });
            base.OnConfiguring(options);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Member>().ToTable("Members");
            modelBuilder.Entity<Transaction>().ToTable("Transactions");

            Member matthew = new Member { Id = 1, FirstName = "Matthew", LastName = "Barneto", Email = "asdasdsa@giasndc.com" };
            List<Member> members = new List<Member> {
                matthew,
                new Member { Id = 2, FirstName = "Nicholas", LastName = "Cage", Email = "5435@123.com" },
                new Member { Id = 3, FirstName = "Lucas", LastName = "Van", Email = "van@giasndc.com" },
                new Member { Id = 4, FirstName = "Jeff", LastName = "Hayes", Email = "hfdij@giasndc.com" }
            };
            modelBuilder.Entity<Member>().HasData(members);

            List<Transaction> transactions = new List<Transaction> {
                new Transaction { Id = 1, MemberId = matthew.Id, Date = "", PointsEarned = 10 }
            };

            modelBuilder.Entity<Transaction>().HasData(transactions);

            /*
            modelBuilder.Entity<InviteModel>().ToTable("Invites", "test");

            List<UserModel> users = new List<UserModel>();
            for (int i = 0; i < 10; i++) {
                users.Add(new UserModel { Id = $"test{i}", Email = $"email{i}@gmail.com", AccountCreateTime = new DateTime(2021, i + 1, 20).Ticks, LastSigninTime = DateTime.Now.Ticks });
            }
            modelBuilder.Entity<UserModel>().HasData(users);

            List<InviteModel> invites = new List<InviteModel>();
            for (int i = 0; i < 10; i++) {
                invites.Add(new InviteModel { CreatorId = $"test{i}", InviteCreationTime = new DateTime(2021, i + 1, 20).Ticks, InviteData = "blob"});
            }
            modelBuilder.Entity<InviteModel>().HasData(invites);
             */
        }
    }
}
