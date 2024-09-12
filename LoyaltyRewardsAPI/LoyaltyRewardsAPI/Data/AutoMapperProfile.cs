using AutoMapper;
using LoyaltyRewardsAPI.Data.Models;

namespace LoyaltyRewardsAPI.Data {
    public class AutoMapperProfile : Profile {
        public AutoMapperProfile() {
            CreateMap<Member, PartialMember>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Meta, opt => opt.MapFrom(src => src.Meta))
                .ForMember(dest => dest.BirthdayMonth, opt => opt.MapFrom(src => src.BirthdayMonth))
                .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points))
                .ForMember(dest => dest.Flags, opt => opt.MapFrom(src => src.Flags))
                .ReverseMap();

            CreateMap<Transaction, PartialTransaction>()
                .ForMember(dest => dest.MemberId, opt => opt.MapFrom(src => src.MemberId))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.PointsEarned, opt => opt.MapFrom(src => src.PointsEarned))
                .ForMember(dest => dest.Employee, opt => opt.MapFrom(src => src.Employee))
                .ReverseMap();
        }
    }
}
