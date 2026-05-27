# Franchisee Management — Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 missing CQRS features (GetFranchiseeById, CreateFranchisee, UpdateFranchisee, DeleteFranchisee) plus 4 controller endpoints to `FranchiseeController`. After this plan, the FE plan `2026-05-27-franchisee-management-fe.md` can be executed.

**Architecture:** All features follow the identical pattern of the Brand module. Each feature = `sealed record Command/Query` + `AbstractValidator` + `Handler`. Controller uses standard `[HttpGet/Post/Put/Delete]` verbs. New files live in `NDTCore.Brand.Application.Features.Franchisees.*` and `NDTCore.Brand.Contracts.ViewModels.Franchisees.*`.

**Tech Stack:** .NET 8, MediatR (`ICommand<T>`, `IQuery<T>`, `ICommandHandler<,>`, `IQueryHandler<,>`), FluentValidation, EF Core, `IFranchiseeRepository`, `IBrandUnitOfWork`, `INdtContextAccessor`

**Key facts:**
- `GetFranchiseeResponse.cs` already exists — reused by `GetFranchiseeById` handler
- `IFranchiseeRepository` has `GetByIdTrackedAsync(int id, ...)` — used by all handlers that mutate or read a single entity
- `FranchiseeRepository.GetByIdTrackedAsync` queries `DbSet` without `.AsNoTracking()` so the entity IS tracked — property mutations are auto-detected by EF Core on `SaveChangesAsync`
- `IFranchiseeRepository` does NOT have a `SoftDelete` method — the delete handler sets `IsDeleted/DeletedAt/DeletedBy` properties directly
- `AppFranchisee` entity fields: `TenantId`, `BrandId`, `Name`, `LegalName`, `TaxCode`, `BankAccount`, `BankName`, `JoinedDate`, `TerminatedDate`, `IsActive`, `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `IsDeleted`, `DeletedAt`, `DeletedBy`
- `AppFranchiseeUser` entity fields: `TenantId`, `FranchiseeId`, `UserId` — added as initial member when creating

---

## File Structure

### New — Contracts
```
NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/
├── CreateFranchiseeRequest.cs    (NEW)
├── CreateFranchiseeResponse.cs   (NEW)
├── UpdateFranchiseeRequest.cs    (NEW)
├── UpdateFranchiseeResponse.cs   (NEW)
└── DeleteFranchiseeResponse.cs   (NEW)
```

### New — Application Features
```
NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/
├── GetFranchiseeById/
│   ├── GetFranchiseeByIdQuery.cs          (NEW)
│   ├── GetFranchiseeByIdQueryValidator.cs (NEW)
│   └── GetFranchiseeByIdQueryHandler.cs   (NEW)
├── CreateFranchisee/
│   ├── CreateFranchiseeCommand.cs          (NEW)
│   ├── CreateFranchiseeCommandValidator.cs (NEW)
│   └── CreateFranchiseeCommandHandler.cs   (NEW)
├── UpdateFranchisee/
│   ├── UpdateFranchiseeCommand.cs          (NEW)
│   ├── UpdateFranchiseeCommandValidator.cs (NEW)
│   └── UpdateFranchiseeCommandHandler.cs   (NEW)
└── DeleteFranchisee/
    ├── DeleteFranchiseeCommand.cs          (NEW)
    ├── DeleteFranchiseeCommandValidator.cs (NEW)
    └── DeleteFranchiseeCommandHandler.cs   (NEW)
```

### Modified
```
NDTCore.BE/src/NDTCore.API/Controllers/Modules/Brand/Admin/FranchiseeController.cs
```

---

## Task 1: New Contracts

**Files:**
- Create: `NDTCore.Brand.Contracts/ViewModels/Franchisees/CreateFranchiseeRequest.cs`
- Create: `NDTCore.Brand.Contracts/ViewModels/Franchisees/CreateFranchiseeResponse.cs`
- Create: `NDTCore.Brand.Contracts/ViewModels/Franchisees/UpdateFranchiseeRequest.cs`
- Create: `NDTCore.Brand.Contracts/ViewModels/Franchisees/UpdateFranchiseeResponse.cs`
- Create: `NDTCore.Brand.Contracts/ViewModels/Franchisees/DeleteFranchiseeResponse.cs`

- [ ] **Step 1: Create CreateFranchiseeRequest.cs**

Full path: `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/CreateFranchiseeRequest.cs`

```csharp
namespace NDTCore.Brand.Contracts.ViewModels.Franchisees;

public sealed class CreateFranchiseeRequest
{
    public int BrandId { get; set; }
    public string Name { get; set; } = default!;
    public string? LegalName { get; set; }
    public string? TaxCode { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public DateTimeOffset? JoinedDate { get; set; }
}
```

- [ ] **Step 2: Create CreateFranchiseeResponse.cs**

Full path: `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/CreateFranchiseeResponse.cs`

```csharp
namespace NDTCore.Brand.Contracts.ViewModels.Franchisees;

public sealed class CreateFranchiseeResponse
{
    public int Id { get; set; }
    public Guid TenantId { get; set; }
    public int BrandId { get; set; }
    public string Name { get; set; } = default!;
    public string? LegalName { get; set; }
    public string? TaxCode { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public DateTimeOffset? JoinedDate { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
}
```

- [ ] **Step 3: Create UpdateFranchiseeRequest.cs**

Full path: `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/UpdateFranchiseeRequest.cs`

```csharp
namespace NDTCore.Brand.Contracts.ViewModels.Franchisees;

public sealed class UpdateFranchiseeRequest
{
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public string? LegalName { get; set; }
    public string? TaxCode { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public DateTimeOffset? JoinedDate { get; set; }
    public DateTimeOffset? TerminatedDate { get; set; }
}
```

- [ ] **Step 4: Create UpdateFranchiseeResponse.cs**

Full path: `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/UpdateFranchiseeResponse.cs`

```csharp
namespace NDTCore.Brand.Contracts.ViewModels.Franchisees;

public sealed class UpdateFranchiseeResponse
{
    public int Id { get; set; }
    public Guid TenantId { get; set; }
    public int BrandId { get; set; }
    public string Name { get; set; } = default!;
    public string? LegalName { get; set; }
    public string? TaxCode { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public DateTimeOffset? JoinedDate { get; set; }
    public DateTimeOffset? TerminatedDate { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
```

- [ ] **Step 5: Create DeleteFranchiseeResponse.cs**

Full path: `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/DeleteFranchiseeResponse.cs`

```csharp
namespace NDTCore.Brand.Contracts.ViewModels.Franchisees;

public sealed class DeleteFranchiseeResponse
{
    public int FranchiseeId { get; set; }
    public string? Name { get; set; }
    public DateTimeOffset DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}
```

- [ ] **Step 6: Build Contracts project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/NDTCore.Brand.Contracts.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 7: Commit**

```bash
git add NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Contracts/ViewModels/Franchisees/
git commit -m "feat(brand): add Franchisee CRUD contracts (Request/Response DTOs)"
```

---

## Task 2: GetFranchiseeById Feature

**Path prefix:** `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/GetFranchiseeById/`

- [ ] **Step 1: Create GetFranchiseeByIdQuery.cs**

```csharp
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.CQRS;

namespace NDTCore.Brand.Application.Features.Franchisees.GetFranchiseeById;

public sealed record GetFranchiseeByIdQuery(int FranchiseeId) : IQuery<GetFranchiseeResponse>;
```

- [ ] **Step 2: Create GetFranchiseeByIdQueryValidator.cs**

```csharp
using FluentValidation;

namespace NDTCore.Brand.Application.Features.Franchisees.GetFranchiseeById;

public sealed class GetFranchiseeByIdQueryValidator : AbstractValidator<GetFranchiseeByIdQuery>
{
    public GetFranchiseeByIdQueryValidator()
    {
        RuleFor(x => x.FranchiseeId)
            .GreaterThan(0)
                .WithMessage("FranchiseeId must be greater than 0.");
    }
}
```

- [ ] **Step 3: Create GetFranchiseeByIdQueryHandler.cs**

```csharp
using Microsoft.Extensions.Logging;
using NDTCore.Brand.Contracts.Interfaces.Repositories;
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.Contexts;
using NDTCore.BuildingBlocks.Abstractions.CQRS;
using NDTCore.BuildingBlocks.Core.Results;

namespace NDTCore.Brand.Application.Features.Franchisees.GetFranchiseeById;

public sealed class GetFranchiseeByIdQueryHandler : IQueryHandler<GetFranchiseeByIdQuery, GetFranchiseeResponse>
{
    private readonly ILogger<GetFranchiseeByIdQueryHandler> _logger;
    private readonly INdtContextAccessor _contextAccessor;
    private readonly IFranchiseeRepository _franchiseeRepository;

    public GetFranchiseeByIdQueryHandler(
        ILogger<GetFranchiseeByIdQueryHandler> logger,
        INdtContextAccessor contextAccessor,
        IFranchiseeRepository franchiseeRepository)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _franchiseeRepository = franchiseeRepository;
    }

    public async Task<Result<GetFranchiseeResponse>> Handle(
        GetFranchiseeByIdQuery request,
        CancellationToken cancellationToken)
    {
        var tenantId = _contextAccessor.Context!.TenantId;

        var franchisee = await _franchiseeRepository.GetByIdTrackedAsync(request.FranchiseeId, cancellationToken);

        if (franchisee is null || franchisee.TenantId != tenantId)
        {
            _logger.LogWarning(
                "[{ClassName}.{FunctionName}] Franchisee not found: FranchiseeId={FranchiseeId}, TenantId={TenantId}",
                nameof(GetFranchiseeByIdQueryHandler),
                nameof(Handle),
                request.FranchiseeId,
                tenantId);

            return Result<GetFranchiseeResponse>.Failure(
                Error.NotFound($"Franchisee '{request.FranchiseeId}' was not found."));
        }

        return Result<GetFranchiseeResponse>.Success(new GetFranchiseeResponse
        {
            Id = franchisee.Id,
            TenantId = franchisee.TenantId,
            BrandId = franchisee.BrandId,
            Name = franchisee.Name,
            LegalName = franchisee.LegalName,
            TaxCode = franchisee.TaxCode,
            BankAccount = franchisee.BankAccount,
            BankName = franchisee.BankName,
            JoinedDate = franchisee.JoinedDate,
            TerminatedDate = franchisee.TerminatedDate,
            IsActive = franchisee.IsActive,
            CreatedAt = franchisee.CreatedAt,
            CreatedBy = franchisee.CreatedBy,
            UpdatedAt = franchisee.UpdatedAt,
            UpdatedBy = franchisee.UpdatedBy,
        });
    }
}
```

- [ ] **Step 4: Build Application project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/NDTCore.Brand.Application.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
git add NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/GetFranchiseeById/
git commit -m "feat(brand): add GetFranchiseeById query + handler"
```

---

## Task 3: CreateFranchisee Feature

**Path prefix:** `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/CreateFranchisee/`

- [ ] **Step 1: Create CreateFranchiseeCommand.cs**

```csharp
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.CQRS;

namespace NDTCore.Brand.Application.Features.Franchisees.CreateFranchisee;

public sealed record CreateFranchiseeCommand : ICommand<CreateFranchiseeResponse>
{
    public CreateFranchiseeCommand(CreateFranchiseeRequest request)
    {
        BrandId = request.BrandId;
        Name = request.Name;
        LegalName = request.LegalName;
        TaxCode = request.TaxCode;
        BankAccount = request.BankAccount;
        BankName = request.BankName;
        JoinedDate = request.JoinedDate;
    }

    public int BrandId { get; init; }
    public string Name { get; init; } = default!;
    public string? LegalName { get; init; }
    public string? TaxCode { get; init; }
    public string? BankAccount { get; init; }
    public string? BankName { get; init; }
    public DateTimeOffset? JoinedDate { get; init; }
}
```

- [ ] **Step 2: Create CreateFranchiseeCommandValidator.cs**

```csharp
using FluentValidation;

namespace NDTCore.Brand.Application.Features.Franchisees.CreateFranchisee;

public sealed class CreateFranchiseeCommandValidator : AbstractValidator<CreateFranchiseeCommand>
{
    public CreateFranchiseeCommandValidator()
    {
        RuleFor(x => x.BrandId)
            .GreaterThan(0)
                .WithMessage("BrandId must be greater than 0.");

        RuleFor(x => x.Name)
            .NotEmpty()
                .WithMessage("Name is required.")
            .MaximumLength(200)
                .WithMessage("Name must not exceed 200 characters.");

        RuleFor(x => x.LegalName)
            .MaximumLength(300)
                .WithMessage("LegalName must not exceed 300 characters.")
            .When(x => x.LegalName is not null);

        RuleFor(x => x.TaxCode)
            .MaximumLength(20)
                .WithMessage("TaxCode must not exceed 20 characters.")
            .When(x => x.TaxCode is not null);

        RuleFor(x => x.BankAccount)
            .MaximumLength(50)
                .WithMessage("BankAccount must not exceed 50 characters.")
            .When(x => x.BankAccount is not null);

        RuleFor(x => x.BankName)
            .MaximumLength(100)
                .WithMessage("BankName must not exceed 100 characters.")
            .When(x => x.BankName is not null);
    }
}
```

- [ ] **Step 3: Create CreateFranchiseeCommandHandler.cs**

```csharp
using Microsoft.Extensions.Logging;
using NDTCore.Brand.Contracts.Interfaces.Repositories;
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.Brand.Domain.Entities;
using NDTCore.BuildingBlocks.Abstractions.Contexts;
using NDTCore.BuildingBlocks.Abstractions.CQRS;
using NDTCore.BuildingBlocks.Core.Results;

namespace NDTCore.Brand.Application.Features.Franchisees.CreateFranchisee;

public sealed class CreateFranchiseeCommandHandler : ICommandHandler<CreateFranchiseeCommand, CreateFranchiseeResponse>
{
    private readonly ILogger<CreateFranchiseeCommandHandler> _logger;
    private readonly INdtContextAccessor _contextAccessor;
    private readonly IFranchiseeRepository _franchiseeRepository;
    private readonly IBrandUnitOfWork _unitOfWork;

    public CreateFranchiseeCommandHandler(
        ILogger<CreateFranchiseeCommandHandler> logger,
        INdtContextAccessor contextAccessor,
        IFranchiseeRepository franchiseeRepository,
        IBrandUnitOfWork unitOfWork)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _franchiseeRepository = franchiseeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<CreateFranchiseeResponse>> Handle(
        CreateFranchiseeCommand request,
        CancellationToken cancellationToken)
    {
        var tenantId = _contextAccessor.GetTenantId();
        var contextUserId = _contextAccessor.GetUserId();
        var contextEmail = _contextAccessor.Context!.Email;
        var now = DateTimeOffset.UtcNow;

        var franchisee = new AppFranchisee
        {
            TenantId = tenantId,
            BrandId = request.BrandId,
            Name = request.Name,
            LegalName = request.LegalName,
            TaxCode = request.TaxCode,
            BankAccount = request.BankAccount,
            BankName = request.BankName,
            JoinedDate = request.JoinedDate,
            IsActive = true,
            CreatedAt = now,
            CreatedBy = contextEmail,
            FranchiseeUsers = new List<AppFranchiseeUser>
            {
                new()
                {
                    TenantId = tenantId,
                    UserId = contextUserId,
                }
            }
        };

        await _franchiseeRepository.AddAsync(franchisee, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "[{ClassName}.{FunctionName}] Franchisee created: FranchiseeId={FranchiseeId}, BrandId={BrandId}, TenantId={TenantId}",
            nameof(CreateFranchiseeCommandHandler),
            nameof(Handle),
            franchisee.Id,
            franchisee.BrandId,
            tenantId);

        return Result<CreateFranchiseeResponse>.Success(new CreateFranchiseeResponse
        {
            Id = franchisee.Id,
            TenantId = franchisee.TenantId,
            BrandId = franchisee.BrandId,
            Name = franchisee.Name,
            LegalName = franchisee.LegalName,
            TaxCode = franchisee.TaxCode,
            BankAccount = franchisee.BankAccount,
            BankName = franchisee.BankName,
            JoinedDate = franchisee.JoinedDate,
            IsActive = franchisee.IsActive,
            CreatedAt = franchisee.CreatedAt,
            CreatedBy = franchisee.CreatedBy,
        });
    }
}
```

- [ ] **Step 4: Build Application project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/NDTCore.Brand.Application.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
git add NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/CreateFranchisee/
git commit -m "feat(brand): add CreateFranchisee command + handler"
```

---

## Task 4: UpdateFranchisee Feature

**Path prefix:** `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/UpdateFranchisee/`

- [ ] **Step 1: Create UpdateFranchiseeCommand.cs**

```csharp
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.CQRS;

namespace NDTCore.Brand.Application.Features.Franchisees.UpdateFranchisee;

public sealed record UpdateFranchiseeCommand : ICommand<UpdateFranchiseeResponse>
{
    public UpdateFranchiseeCommand(int franchiseeId, UpdateFranchiseeRequest request)
    {
        FranchiseeId = franchiseeId;
        Name = request.Name;
        IsActive = request.IsActive;
        LegalName = request.LegalName;
        TaxCode = request.TaxCode;
        BankAccount = request.BankAccount;
        BankName = request.BankName;
        JoinedDate = request.JoinedDate;
        TerminatedDate = request.TerminatedDate;
    }

    public int FranchiseeId { get; init; }
    public string Name { get; init; } = default!;
    public bool IsActive { get; init; }
    public string? LegalName { get; init; }
    public string? TaxCode { get; init; }
    public string? BankAccount { get; init; }
    public string? BankName { get; init; }
    public DateTimeOffset? JoinedDate { get; init; }
    public DateTimeOffset? TerminatedDate { get; init; }
}
```

- [ ] **Step 2: Create UpdateFranchiseeCommandValidator.cs**

```csharp
using FluentValidation;

namespace NDTCore.Brand.Application.Features.Franchisees.UpdateFranchisee;

public sealed class UpdateFranchiseeCommandValidator : AbstractValidator<UpdateFranchiseeCommand>
{
    public UpdateFranchiseeCommandValidator()
    {
        RuleFor(x => x.FranchiseeId)
            .GreaterThan(0)
                .WithMessage("FranchiseeId must be greater than 0.");

        RuleFor(x => x.Name)
            .NotEmpty()
                .WithMessage("Name is required.")
            .MaximumLength(200)
                .WithMessage("Name must not exceed 200 characters.");

        RuleFor(x => x.LegalName)
            .MaximumLength(300)
                .WithMessage("LegalName must not exceed 300 characters.")
            .When(x => x.LegalName is not null);

        RuleFor(x => x.TaxCode)
            .MaximumLength(20)
                .WithMessage("TaxCode must not exceed 20 characters.")
            .When(x => x.TaxCode is not null);

        RuleFor(x => x.BankAccount)
            .MaximumLength(50)
                .WithMessage("BankAccount must not exceed 50 characters.")
            .When(x => x.BankAccount is not null);

        RuleFor(x => x.BankName)
            .MaximumLength(100)
                .WithMessage("BankName must not exceed 100 characters.")
            .When(x => x.BankName is not null);
    }
}
```

- [ ] **Step 3: Create UpdateFranchiseeCommandHandler.cs**

```csharp
using Microsoft.Extensions.Logging;
using NDTCore.Brand.Contracts.Interfaces.Repositories;
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.Contexts;
using NDTCore.BuildingBlocks.Abstractions.CQRS;
using NDTCore.BuildingBlocks.Core.Results;

namespace NDTCore.Brand.Application.Features.Franchisees.UpdateFranchisee;

public sealed class UpdateFranchiseeCommandHandler : ICommandHandler<UpdateFranchiseeCommand, UpdateFranchiseeResponse>
{
    private readonly ILogger<UpdateFranchiseeCommandHandler> _logger;
    private readonly INdtContextAccessor _contextAccessor;
    private readonly IFranchiseeRepository _franchiseeRepository;
    private readonly IBrandUnitOfWork _unitOfWork;

    public UpdateFranchiseeCommandHandler(
        ILogger<UpdateFranchiseeCommandHandler> logger,
        INdtContextAccessor contextAccessor,
        IFranchiseeRepository franchiseeRepository,
        IBrandUnitOfWork unitOfWork)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _franchiseeRepository = franchiseeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<UpdateFranchiseeResponse>> Handle(
        UpdateFranchiseeCommand request,
        CancellationToken cancellationToken)
    {
        var tenantId = _contextAccessor.Context!.TenantId;
        var contextEmail = _contextAccessor.Context!.Email;

        var franchisee = await _franchiseeRepository.GetByIdTrackedAsync(request.FranchiseeId, cancellationToken);

        if (franchisee is null || franchisee.TenantId != tenantId)
        {
            _logger.LogWarning(
                "[{ClassName}.{FunctionName}] Franchisee not found: FranchiseeId={FranchiseeId}, TenantId={TenantId}",
                nameof(UpdateFranchiseeCommandHandler),
                nameof(Handle),
                request.FranchiseeId,
                tenantId);

            return Result<UpdateFranchiseeResponse>.Failure(
                Error.NotFound($"Franchisee '{request.FranchiseeId}' was not found."));
        }

        franchisee.Name = request.Name;
        franchisee.IsActive = request.IsActive;
        franchisee.LegalName = request.LegalName;
        franchisee.TaxCode = request.TaxCode;
        franchisee.BankAccount = request.BankAccount;
        franchisee.BankName = request.BankName;
        franchisee.JoinedDate = request.JoinedDate;
        franchisee.TerminatedDate = request.TerminatedDate;
        franchisee.UpdatedAt = DateTimeOffset.UtcNow;
        franchisee.UpdatedBy = contextEmail;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "[{ClassName}.{FunctionName}] Franchisee updated: FranchiseeId={FranchiseeId}, TenantId={TenantId}",
            nameof(UpdateFranchiseeCommandHandler),
            nameof(Handle),
            franchisee.Id,
            tenantId);

        return Result<UpdateFranchiseeResponse>.Success(new UpdateFranchiseeResponse
        {
            Id = franchisee.Id,
            TenantId = franchisee.TenantId,
            BrandId = franchisee.BrandId,
            Name = franchisee.Name,
            LegalName = franchisee.LegalName,
            TaxCode = franchisee.TaxCode,
            BankAccount = franchisee.BankAccount,
            BankName = franchisee.BankName,
            JoinedDate = franchisee.JoinedDate,
            TerminatedDate = franchisee.TerminatedDate,
            IsActive = franchisee.IsActive,
            UpdatedAt = franchisee.UpdatedAt,
            UpdatedBy = franchisee.UpdatedBy,
        });
    }
}
```

- [ ] **Step 4: Build Application project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/NDTCore.Brand.Application.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
git add NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/UpdateFranchisee/
git commit -m "feat(brand): add UpdateFranchisee command + handler"
```

---

## Task 5: DeleteFranchisee Feature

**Path prefix:** `NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/DeleteFranchisee/`

- [ ] **Step 1: Create DeleteFranchiseeCommand.cs**

```csharp
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.CQRS;

namespace NDTCore.Brand.Application.Features.Franchisees.DeleteFranchisee;

public sealed record DeleteFranchiseeCommand(int FranchiseeId) : ICommand<DeleteFranchiseeResponse>;
```

- [ ] **Step 2: Create DeleteFranchiseeCommandValidator.cs**

```csharp
using FluentValidation;

namespace NDTCore.Brand.Application.Features.Franchisees.DeleteFranchisee;

public sealed class DeleteFranchiseeCommandValidator : AbstractValidator<DeleteFranchiseeCommand>
{
    public DeleteFranchiseeCommandValidator()
    {
        RuleFor(x => x.FranchiseeId)
            .GreaterThan(0)
                .WithMessage("FranchiseeId must be greater than 0.");
    }
}
```

- [ ] **Step 3: Create DeleteFranchiseeCommandHandler.cs**

```csharp
using Microsoft.Extensions.Logging;
using NDTCore.Brand.Contracts.Interfaces.Repositories;
using NDTCore.Brand.Contracts.ViewModels.Franchisees;
using NDTCore.BuildingBlocks.Abstractions.Contexts;
using NDTCore.BuildingBlocks.Abstractions.CQRS;
using NDTCore.BuildingBlocks.Core.Results;

namespace NDTCore.Brand.Application.Features.Franchisees.DeleteFranchisee;

public sealed class DeleteFranchiseeCommandHandler : ICommandHandler<DeleteFranchiseeCommand, DeleteFranchiseeResponse>
{
    private readonly ILogger<DeleteFranchiseeCommandHandler> _logger;
    private readonly INdtContextAccessor _contextAccessor;
    private readonly IFranchiseeRepository _franchiseeRepository;
    private readonly IBrandUnitOfWork _unitOfWork;

    public DeleteFranchiseeCommandHandler(
        ILogger<DeleteFranchiseeCommandHandler> logger,
        INdtContextAccessor contextAccessor,
        IFranchiseeRepository franchiseeRepository,
        IBrandUnitOfWork unitOfWork)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _franchiseeRepository = franchiseeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<DeleteFranchiseeResponse>> Handle(
        DeleteFranchiseeCommand request,
        CancellationToken cancellationToken)
    {
        var tenantId = _contextAccessor.Context!.TenantId;
        var contextEmail = _contextAccessor.Context!.Email ?? "system";

        var franchisee = await _franchiseeRepository.GetByIdTrackedAsync(request.FranchiseeId, cancellationToken);

        if (franchisee is null || franchisee.TenantId != tenantId)
        {
            _logger.LogWarning(
                "[{ClassName}.{FunctionName}] Franchisee not found: FranchiseeId={FranchiseeId}, TenantId={TenantId}",
                nameof(DeleteFranchiseeCommandHandler),
                nameof(Handle),
                request.FranchiseeId,
                tenantId);

            return Result<DeleteFranchiseeResponse>.Failure(
                Error.NotFound($"Franchisee '{request.FranchiseeId}' was not found."));
        }

        franchisee.IsDeleted = true;
        franchisee.DeletedAt = DateTimeOffset.UtcNow;
        franchisee.DeletedBy = contextEmail;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "[{ClassName}.{FunctionName}] Franchisee soft-deleted: FranchiseeId={FranchiseeId}, TenantId={TenantId}",
            nameof(DeleteFranchiseeCommandHandler),
            nameof(Handle),
            franchisee.Id,
            tenantId);

        return Result<DeleteFranchiseeResponse>.Success(new DeleteFranchiseeResponse
        {
            FranchiseeId = franchisee.Id,
            Name = franchisee.Name,
            DeletedAt = franchisee.DeletedAt ?? DateTimeOffset.UtcNow,
            DeletedBy = franchisee.DeletedBy,
        });
    }
}
```

- [ ] **Step 4: Build Application project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/NDTCore.Brand.Application.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 5: Commit**

```bash
git add NDTCore.BE/src/NDTCore.Modules/NDTCore.Brand/NDTCore.Brand.Application/Features/Franchisees/DeleteFranchisee/
git commit -m "feat(brand): add DeleteFranchisee command + handler"
```

---

## Task 6: FranchiseeController — Add 4 Endpoints

**File:** `NDTCore.BE/src/NDTCore.API/Controllers/Modules/Brand/Admin/FranchiseeController.cs`

The current controller already has 7 endpoints. Add 4 new ones: `GET {id}`, `POST`, `PUT {id}`, `DELETE {id}`.

- [ ] **Step 1: Add using directives**

Add the following 4 `using` statements after the existing ones at the top of `FranchiseeController.cs`:

```csharp
using NDTCore.Brand.Application.Features.Franchisees.GetFranchiseeById;
using NDTCore.Brand.Application.Features.Franchisees.CreateFranchisee;
using NDTCore.Brand.Application.Features.Franchisees.UpdateFranchisee;
using NDTCore.Brand.Application.Features.Franchisees.DeleteFranchisee;
```

- [ ] **Step 2: Add 4 action methods inside the class body, before the closing `}`**

```csharp
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetFranchiseeById(
        [FromRoute] int id,
        CancellationToken cancellationToken)
    {
        var query = new GetFranchiseeByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        return StatusResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFranchisee(
        [FromBody] CreateFranchiseeRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateFranchiseeCommand(request);
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedResult(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateFranchisee(
        [FromRoute] int id,
        [FromBody] UpdateFranchiseeRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateFranchiseeCommand(id, request);
        var result = await _mediator.Send(command, cancellationToken);

        return StatusResult(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFranchisee(
        [FromRoute] int id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteFranchiseeCommand(id);
        var result = await _mediator.Send(command, cancellationToken);

        return DeletedResult(result);
    }
```

- [ ] **Step 3: Build API project**

```bash
dotnet build "NDTCore.BE/src/NDTCore.API/NDTCore.API.csproj"
```

Expected: `Build succeeded. 0 Error(s)`

- [ ] **Step 4: Run API and verify endpoints in Swagger**

```bash
dotnet run --project "NDTCore.BE/src/NDTCore.API"
```

Open Swagger UI at `https://localhost:<PORT>/swagger`. Verify 4 new endpoints appear under the `Franchisee` group:
- `GET /admin/franchisee/{id}`
- `POST /admin/franchisee`
- `PUT /admin/franchisee/{id}`
- `DELETE /admin/franchisee/{id}`

- [ ] **Step 5: Commit**

```bash
git add NDTCore.BE/src/NDTCore.API/Controllers/Modules/Brand/Admin/FranchiseeController.cs
git commit -m "feat(api): expose GetById/Create/Update/Delete endpoints for Franchisee"
```
