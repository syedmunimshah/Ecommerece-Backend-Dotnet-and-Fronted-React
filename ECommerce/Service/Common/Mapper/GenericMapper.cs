using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Common.Mapper
{
    public class GenericMapper: IGenericMapper
    {
        private readonly IMapper _mapper;
        public GenericMapper(IMapper mapper)
        {
            _mapper = mapper;
        }
        public TDestination Map<TSource, TDestination>(TSource source)
        {

            return _mapper.Map<TDestination>(source);

        }

        public List<TDestination> MapList<TSource, TDestination>(
            IEnumerable<TSource> source)
        {

            return _mapper.Map<List<TDestination>>(source);

        }
    }
}
