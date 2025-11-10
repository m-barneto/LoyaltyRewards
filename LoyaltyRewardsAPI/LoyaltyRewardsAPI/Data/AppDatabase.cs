using LoyaltyRewardsAPI.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;

namespace LoyaltyRewardsAPI.Data {
    public class AppDatabase : DbContext {

        public AppDatabase(DbContextOptions<AppDatabase> options) : base(options) { }

        public DbSet<Member> Members => Set<Member>();
        public DbSet<Transaction> Transactions => Set<Transaction>();
        public DbSet<Reward> Rewards => Set<Reward>();

        protected override void OnConfiguring(DbContextOptionsBuilder options) {
            options.UseSqlite(options => {
                options.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            });
            base.OnConfiguring(options);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Member>().HasMany(x => x.Transactions).WithOne(x => x.Member);
            modelBuilder.Entity<Member>().ToTable("Members");
            modelBuilder.Entity<Transaction>().HasOne(x => x.Member).WithMany(x => x.Transactions).HasForeignKey("MemberId");
            modelBuilder.Entity<Transaction>().ToTable("Transactions");

            modelBuilder.Entity<Reward>().ToTable("Rewards");

            Member matthew = new Member { Id = 1, FirstName = "Matthew", LastName = "Barneto", Email = "asdasdsa@giasndc.com", Meta = "Medium iced americano with 2 shots, no cream." };
            List<Member> members = new List<Member> {
                matthew,
                new Member { Id = 2, FirstName = "Nicholas", LastName = "Cage", Email = "5435@123.com" },
                new Member { Id = 3, FirstName = "Lucas", LastName = "Van", Email = "van@giasndc.com" },
                new Member { Id = 4, FirstName = "Jeff", LastName = "Hayes", Email = "hfdij@giasndc.com" }
            };
            modelBuilder.Entity<Member>().HasData(members);

            List<Transaction> transactions = new List<Transaction> {
                new Transaction { Id = 1, MemberId = matthew.Id, Date = DateTimeOffset.Now.AddHours(4).ToUnixTimeMilliseconds(), PointsEarned = -100, Employee = "Albert" },
                new Transaction { Id = 2, MemberId = matthew.Id, Date = DateTimeOffset.Now.AddHours(1).ToUnixTimeMilliseconds(), PointsEarned = 55, Employee = "Albert" },
                new Transaction { Id = 3, MemberId = matthew.Id, Date = DateTimeOffset.Now.AddHours(2).ToUnixTimeMilliseconds(), PointsEarned = 20, Employee = "Albert" },
                new Transaction { Id = 4, MemberId = matthew.Id, Date = DateTimeOffset.Now.AddHours(3).ToUnixTimeMilliseconds(), PointsEarned = 35, Employee = "Albert" },
            };

            modelBuilder.Entity<Transaction>().HasData(transactions);

            List<Reward> rewards = new List<Reward> {
                new Reward {Id = 1, PointCost = 100, Description = "Any size Coffee or Tea"},
                new Reward {Id = 2, PointCost = 125, Description = "Breakfast Pastry"},
                new Reward {Id = 3, PointCost = 150, Description = "Cold Brew / Americano"},
                new Reward {Id = 4, PointCost = 300, Description = "Latte, Mocha, or Chai"},
            };
            modelBuilder.Entity<Reward>().HasData(rewards);

            ImportCsvData(modelBuilder);
        }

        void ImportCsvData(ModelBuilder modelBuilder) {
            List<Member> members = new List<Member>();
            int i = 5;

            HashSet<string> bdays = new HashSet<string>();

            using (TextFieldParser parser = new TextFieldParser(@"Data\customer_balances.csv")) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(",");
                while (!parser.EndOfData) {
                    //Process row
                    string[] fields = parser.ReadFields();
                    if (fields[0].Contains("DB Timestamp")) continue;
                    string fname = fields[2];
                    string lname = fields[3];
                    string email = fields[6];
                    string bev = fields[16];
                    string bday = fields[18];
                    string concat = fname + lname + email;
                    if (string.IsNullOrEmpty(concat)) continue;
                    members.Add(new Member() {
                        Id = i++,
                        FirstName = fname,
                        LastName = lname,
                        Email = email
                    });
                    bdays.Add(bday);
                }
            }


            modelBuilder.Entity<Member>().HasData(members);
            Console.WriteLine("reee");
        }
    }
}
