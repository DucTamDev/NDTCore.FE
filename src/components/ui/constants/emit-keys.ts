export const APP_DATA_TABLE_EMIT = {
  UPDATE_SELECTED: 'update:selected',
  UPDATE_SORT_BY: 'update:sortBy',
  ROW_CLICK: 'row-click',
} as const

export const APP_DATA_FILTER_EMIT = {
  UPDATE_MODEL_VALUE: 'update:modelValue',
  SEARCH: 'search',
  RESET: 'reset',
} as const

export const APP_PAGINATION_EMIT = {
  UPDATE_PAGE_NUMBER: 'update:pageNumber',
  UPDATE_PAGE_SIZE: 'update:pageSize',
} as const

export const APP_DIALOG_EMIT = {
  UPDATE_MODEL_VALUE: 'update:modelValue',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
} as const

export const APP_ROW_ACTIONS_EMIT = {
  ACTION: 'action',
} as const

export const APP_BULK_ACTIONS_EMIT = {
  ACTION: 'action',
} as const
