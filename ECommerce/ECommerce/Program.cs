using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Repository.Common.Implementation;
using Repository.Common.Interface;
using Repository.Entities;
using Service;
using Service.Common.Mapper;
using Service.Implementations;
using Service.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Repository.Interfaces;
using Repository.Implementations;
using ECommerce.Seed;
using ECommerce.Services;
using ECommerce.Middleware;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Azure.Storage.Blobs;
using Serilog;
using Anthropic;

var builder = WebApplication.CreateBuilder(args);

// Structured logging (console + daily rolling file).
builder.Host.UseSerilog((context, loggerConfig) => loggerConfig
    .ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/edgecart-.log", rollingInterval: RollingInterval.Day));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddCors(options =>
{
    var frontendUrl = builder.Configuration["App:FrontendUrl"] ?? "http://localhost:3000";
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Consistent ProblemDetails error responses via the global exception handler.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

// Honor X-Forwarded-* when running behind a reverse proxy (Azure App Service).
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // JWT token authentication configuration
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and then your JWT token."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("User"));
    options.AddPolicy("Seller", policy => policy.RequireRole("Seller"));
});

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IGenericMapper,GenericMapper>();
builder.Services.AddScoped<IAuthService, AuthService>();
if (builder.Configuration.GetValue<bool>("Smtp:Enabled") &&
    !string.IsNullOrWhiteSpace(builder.Configuration["Smtp:Password"]))
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
else
    builder.Services.AddScoped<IEmailService, ConsoleEmailService>();
// Shopping assistant. The keyword-driven implementation is the default: it answers from
// EdgeCart's own tables, so it needs no API key, costs nothing per message, and works
// offline. Configuring Claude:ApiKey upgrades the same endpoint to the model-backed one,
// which understands free-form questions. The client is a singleton (it owns an HttpClient).
var claudeApiKey = builder.Configuration["Claude:ApiKey"];
if (!string.IsNullOrWhiteSpace(claudeApiKey))
{
    builder.Services.AddSingleton(new AnthropicClient { ApiKey = claudeApiKey });
    builder.Services.AddScoped<IChatService, ChatService>();
}
else
{
    builder.Services.AddScoped<IChatService, RuleBasedChatService>();
}
// Uploads go to Blob Storage when a connection string is configured, otherwise to local
// disk. Blob is what production wants: files survive redeploys and every instance sees
// the same set, whereas disk ties them to one machine. The container client is a
// singleton — it is thread-safe and holds a pooled connection.
var blobConnection = builder.Configuration["Storage:ConnectionString"];
if (!string.IsNullOrWhiteSpace(blobConnection))
{
    var containerName = builder.Configuration["Storage:Container"] ?? "uploads";
    builder.Services.AddSingleton(new BlobContainerClient(blobConnection, containerName));
    builder.Services.AddScoped<IFileStorageService, BlobFileStorageService>();
}
else
{
    builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
}
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ISellerProfileService, SellerProfileService>();
builder.Services.AddScoped<ISellerRepository, SellerRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ECommerce")));

var app = builder.Build();

// Behind a proxy (Azure App Service) honor the forwarded scheme/IP first.
app.UseForwardedHeaders();

// Catch-all → ProblemDetails. Must be early so it wraps the rest of the pipeline.
app.UseExceptionHandler();

// Configure the HTTP request pipeline. Swagger is on in Development; elsewhere it is
// opt-in (Swagger:Enabled) so the hosted demo can expose its API docs.
if (app.Configuration.GetValue("Swagger:Enabled", app.Environment.IsDevelopment()))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();

app.UseCors("Frontend");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

// Uploads live outside wwwroot when FileUpload:RootPath is set, so that publishing —
// which replaces the deployment folder — cannot delete user-uploaded images. Serve that
// directory at the same /uploads URL the stored image links already use.
var uploadsRoot = app.Configuration["FileUpload:RootPath"];
if (!string.IsNullOrWhiteSpace(uploadsRoot))
{
    Directory.CreateDirectory(uploadsRoot);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(uploadsRoot),
        RequestPath = "/uploads"
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Start listening FIRST so Swagger / the API is reachable immediately. Migration and
// dev-only seeding then run without blocking the host from binding the port (this also
// stops the debugger from delaying Swagger while it steps through startup DB work).
await app.StartAsync();

try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await RoleEnsurer.EnsureAsync(db);
    // Demo/dummy data: on by default outside Production, opt-in elsewhere (Seed:DemoData)
    // so the hosted demo can be populated without running as Development.
    if (app.Configuration.GetValue("Seed:DemoData", !app.Environment.IsProduction()))
    {
        await DummyDataSeeder.SeedAsync(db);
    }
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Database migration/seed failed");
}

await app.WaitForShutdownAsync();
