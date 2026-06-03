import type { FranchiseeViewModel } from '../models/view-models/franchisee.view-model'
import type { FranchiseeFormModel } from '../models/form-models/franchisee.model'
import type { UpdateFranchiseeRequest } from '../models/dtos/update-franchisee.dto'

export const TRACKED_FIELDS: ReadonlyArray<keyof FranchiseeFormModel> = [
    'name', 'legalName', 'taxCode', 'bankAccount', 'bankName',
    'joinedDate', 'terminatedDate', 'isActive',
] as const

export function toForm(entity: FranchiseeViewModel): FranchiseeFormModel {
    return {
        brandId: entity.brandId,
        name: entity.name ?? '',
        legalName: entity.legalName ?? null,
        taxCode: entity.taxCode ?? null,
        bankAccount: entity.bankAccount ?? null,
        bankName: entity.bankName ?? null,
        joinedDate: entity.joinedDate ?? null,
        terminatedDate: entity.terminatedDate ?? null,
        isActive: entity.isActive ?? true,
    }
}

export function toPayload(form: FranchiseeFormModel): UpdateFranchiseeRequest {
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
}

export function emptyForm(): FranchiseeFormModel {
    return {
        brandId: null,
        name: '',
        legalName: null,
        taxCode: null,
        bankAccount: null,
        bankName: null,
        joinedDate: null,
        terminatedDate: null,
        isActive: true,
    }
}
