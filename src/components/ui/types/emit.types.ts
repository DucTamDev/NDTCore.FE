import {
    APP_BULK_ACTIONS_EMIT,
    APP_DATA_FILTER_EMIT,
    APP_DATA_TABLE_EMIT,
    APP_DIALOG_EMIT,
    APP_PAGINATION_EMIT,
    APP_ROW_ACTIONS_EMIT,
} from '../constants/emit-keys'
import type { ActiveFilters } from './filter'
import type { SortState } from './table'

export type AppDataTableEmits<T> = {
    (event: typeof APP_DATA_TABLE_EMIT.UPDATE_SELECTED, value: T[]): void
    (event: typeof APP_DATA_TABLE_EMIT.UPDATE_SORT_BY, value: SortState | null): void
    (event: typeof APP_DATA_TABLE_EMIT.ROW_CLICK, item: T): void
}

export type AppDataFilterEmits = {
    (event: typeof APP_DATA_FILTER_EMIT.UPDATE_MODEL_VALUE, value: ActiveFilters): void
    (event: typeof APP_DATA_FILTER_EMIT.SEARCH): void
    (event: typeof APP_DATA_FILTER_EMIT.RESET): void
}

export type AppPaginationEmits = {
    (event: typeof APP_PAGINATION_EMIT.UPDATE_PAGE_NUMBER, value: number): void
    (event: typeof APP_PAGINATION_EMIT.UPDATE_PAGE_SIZE, value: number): void
}

export type AppDialogEmits = {
    (event: typeof APP_DIALOG_EMIT.UPDATE_MODEL_VALUE, value: boolean): void
    (event: typeof APP_DIALOG_EMIT.CONFIRM): void
    (event: typeof APP_DIALOG_EMIT.CANCEL): void
}

export type AppRowActionsEmits<T> = {
    (event: typeof APP_ROW_ACTIONS_EMIT.ACTION, key: string, item: T): void
}

export type AppBulkActionsEmits<T> = {
    (event: typeof APP_BULK_ACTIONS_EMIT.ACTION, key: string, items: T[]): void
}
