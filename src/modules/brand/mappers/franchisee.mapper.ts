import type {
    FranchiseeDto,
    CreateFranchiseeResponse,
    UpdateFranchiseeResponse,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/brand/models/dtos/_index'
import type { FranchiseeFormModel } from '@/modules/brand/models/form-models/franchisee.model'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'

export const franchiseeMapper = {
    toViewModels(dtos: FranchiseeDto[]): FranchiseeViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: FranchiseeDto): FranchiseeViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            brandId: dto.BrandId,
            name: dto.Name,
            legalName: dto.LegalName ?? null,
            taxCode: dto.TaxCode ?? null,
            bankAccount: dto.BankAccount ?? null,
            bankName: dto.BankName ?? null,
            isActive: dto.IsActive,
            joinedDate: dto.JoinedDate ?? null,
            terminatedDate: dto.TerminatedDate ?? null,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
        }
    },

    toFormModel(vm: FranchiseeViewModel | null): FranchiseeFormModel | null {
        if (!vm) return null
        return {
            brandId: vm.brandId,
            name: vm.name ?? '',
            legalName: vm.legalName ?? null,
            taxCode: vm.taxCode ?? null,
            bankAccount: vm.bankAccount ?? null,
            bankName: vm.bankName ?? null,
            joinedDate: vm.joinedDate ?? null,
            terminatedDate: vm.terminatedDate ?? null,
            isActive: vm.isActive ?? true,
            createdAt: vm.createdAt ?? null,
            createdBy: vm.createdBy ?? null,
            updatedAt: vm.updatedAt ?? null,
            updatedBy: vm.updatedBy ?? null,
        }
    },

    createResponseToViewModel(r: CreateFranchiseeResponse): FranchiseeViewModel {
        return {
            id: r.Id,
            tenantId: r.TenantId,
            brandId: r.BrandId,
            name: r.Name,
            legalName: r.LegalName ?? null,
            taxCode: r.TaxCode ?? null,
            bankAccount: r.BankAccount ?? null,
            bankName: r.BankName ?? null,
            isActive: r.IsActive,
            joinedDate: r.JoinedDate ?? null,
            terminatedDate: null,
            createdAt: r.CreatedAt ?? null,
            createdBy: r.CreatedBy ?? null,
            updatedAt: null,
            updatedBy: null,
        }
    },

    updateResponseToViewModel(r: UpdateFranchiseeResponse): FranchiseeViewModel {
        return {
            id: r.Id,
            tenantId: r.TenantId,
            brandId: r.BrandId,
            name: r.Name,
            legalName: r.LegalName ?? null,
            taxCode: r.TaxCode ?? null,
            bankAccount: r.BankAccount ?? null,
            bankName: r.BankName ?? null,
            isActive: r.IsActive,
            joinedDate: r.JoinedDate ?? null,
            terminatedDate: r.TerminatedDate ?? null,
            createdAt: null,
            createdBy: null,
            updatedAt: r.UpdatedAt ?? null,
            updatedBy: r.UpdatedBy ?? null,
        }
    },

    formModelToCreateRequest(form: FranchiseeFormModel): CreateFranchiseeRequest {
        return {
            BrandId: form.brandId!,
            Name: form.name.trim(),
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            BankAccount: form.bankAccount?.trim() ?? null,
            BankName: form.bankName?.trim() ?? null,
            JoinedDate: form.joinedDate ?? null,
        }
    },

    formModelToUpdateRequest(form: FranchiseeFormModel): UpdateFranchiseeRequest {
        return {
            Name: form.name.trim(),
            IsActive: form.isActive,
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            BankAccount: form.bankAccount?.trim() ?? null,
            BankName: form.bankName?.trim() ?? null,
            JoinedDate: form.joinedDate ?? null,
            TerminatedDate: form.terminatedDate ?? null,
        }
    },
}
