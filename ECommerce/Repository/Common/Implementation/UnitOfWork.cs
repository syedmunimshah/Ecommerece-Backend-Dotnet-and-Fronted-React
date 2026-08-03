using Microsoft.EntityFrameworkCore.Storage;
using Repository.Common.Interface;
using Repository.Entities;

namespace Repository.Common.Implementation
{
    /// <inheritdoc cref="IUnitOfWork" />
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();

        public Task<IDbContextTransaction> BeginTransactionAsync() =>
            _context.Database.BeginTransactionAsync();
    }
}
