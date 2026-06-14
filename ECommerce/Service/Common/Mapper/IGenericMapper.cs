using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Common.Mapper
{
    public interface IGenericMapper
    {
        TDestination Map<TSource, TDestination>(TSource source);

        List<TDestination> MapList<TSource, TDestination>(IEnumerable<TSource> source);
    }
}
