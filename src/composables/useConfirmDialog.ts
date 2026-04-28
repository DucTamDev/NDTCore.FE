import { useUiStore } from '@/stores/ui.store'
import type { ConfirmDialogOptions } from '@/infrastructure/types/common.types'

export function useConfirmDialog() {
  const uiStore = useUiStore()

  return {
    confirm: (options: ConfirmDialogOptions) => uiStore.openConfirmDialog(options),
  }
}
