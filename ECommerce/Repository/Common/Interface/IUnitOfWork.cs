using Microsoft.EntityFrameworkCore.Storage;

namespace Repository.Common.Interface
{
    /// <summary>
    /// Coordinates a single unit of work across multiple repositories that share
    /// the same scoped <see cref="Repository.Entities.AppDbContext"/>, so a group
    /// of writes (e.g. order + order items + stock decrement + cart clear) commit
    /// or roll back atomically.
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>Persists all staged changes on the shared context.</summary>
        Task<int> SaveChangesAsync();

        /// <summary>Begins a database transaction on the shared context.</summary>
        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
