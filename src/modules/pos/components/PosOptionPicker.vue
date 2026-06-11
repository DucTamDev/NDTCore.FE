<template>
  <v-dialog v-model="open" max-width="560" scrollable>
    <v-card v-if="product" rounded="lg">
      <v-img v-if="product.ImageUrl" :src="product.ImageUrl" height="180" cover />
      <v-card-title class="pt-3 pb-0">{{ product.Name }}</v-card-title>
      <v-card-subtitle v-if="product.ShortDescription" class="text-caption font-italic pb-1">
        {{ product.ShortDescription }}
      </v-card-subtitle>
      <v-card-subtitle class="text-primary font-weight-semibold pb-2">
        {{ product.ResolvedPrice.toLocaleString('vi-VN') }}₫ (giá cơ bản)
      </v-card-subtitle>

      <v-divider />

      <v-card-text class="pa-4">
        <div class="d-flex flex-column ga-6">
          <!-- Option groups -->
          <div v-for="group in product.OptionGroups" :key="group.GroupId">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 font-weight-semibold">{{ group.GroupName }}</span>
              <v-chip
                size="x-small"
                :color="group.IsRequired ? 'error' : 'default'"
                variant="tonal"
              >
                {{
                  group.IsRequired
                    ? group.MinSelect === group.MaxSelect
                      ? `Bắt buộc · Chọn ${group.MinSelect}`
                      : `Bắt buộc · Chọn ${group.MinSelect}–${group.MaxSelect}`
                    : `Tuỳ chọn · Tối đa ${group.MaxSelect}`
                }}
              </v-chip>
            </div>

            <div v-if="groupErrors[group.GroupId]" class="text-error text-caption mb-1">
              {{ groupErrors[group.GroupId] }}
            </div>

            <div class="d-flex flex-column ga-1">
              <v-sheet
                v-for="opt in group.Options"
                :key="opt.Id"
                rounded="lg"
                border
                class="d-flex align-center justify-space-between px-3 py-2"
                :class="isSelected(group.GroupId, opt.Id) ? 'bg-primary-lighten-5' : ''"
                :style="{ opacity: opt.IsAvailable ? 1 : 0.4, cursor: opt.IsAvailable ? 'pointer' : 'not-allowed' }"
                @click="opt.IsAvailable && toggleOption(group, opt)"
              >
                <div class="d-flex align-center ga-3">
                  <v-icon
                    v-if="group.UiType === 'SingleSelect'"
                    :icon="isSelected(group.GroupId, opt.Id) ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                    :color="isSelected(group.GroupId, opt.Id) ? 'primary' : undefined"
                    size="20"
                  />
                  <v-icon
                    v-else
                    :icon="isSelected(group.GroupId, opt.Id) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                    :color="isSelected(group.GroupId, opt.Id) ? 'primary' : undefined"
                    size="20"
                  />
                  <span
                    class="text-body-2"
                    :class="{ 'text-decoration-line-through': !opt.IsAvailable }"
                  >
                    {{ opt.Name }}
                  </span>
                </div>
                <span v-if="opt.ResolvedPrice > 0" class="text-body-2 text-medium-emphasis">
                  +{{ opt.ResolvedPrice.toLocaleString('vi-VN') }}₫
                </span>
              </v-sheet>
            </div>
          </div>

          <!-- Note -->
          <v-textarea
            v-model="note"
            label="Ghi chú cho món này"
            placeholder="VD: ít đá, không đường..."
            rows="2"
            density="compact"
            variant="outlined"
            hide-details
            auto-grow
          />

          <!-- Quantity -->
          <div class="d-flex align-center ga-4">
            <span class="text-subtitle-2">Số lượng</span>
            <div class="d-flex align-center ga-2">
              <v-btn
                icon="mdi-minus"
                variant="outlined"
                size="small"
                :disabled="quantity <= 1"
                @click="quantity--"
              />
              <span class="text-body-1 px-2 text-center" style="min-width: 2rem;">{{ quantity }}</span>
              <v-btn
                icon="mdi-plus"
                variant="outlined"
                size="small"
                @click="quantity++"
              />
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 d-flex align-center justify-space-between">
        <span class="text-subtitle-1 font-weight-semibold">
          {{ lineTotal.toLocaleString('vi-VN') }}₫
        </span>
        <div class="d-flex ga-2">
          <v-btn variant="text" @click="open = false">Huỷ</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!isValid" @click="confirm">
            Thêm vào đơn
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PosProductDto, PosOptionGroupDto, PosOptionDto } from '../models/dtos/pos-catalog.dto'
import type { PosCartItem, PosCartOption } from '../models/types/pos-cart.types'

const props = defineProps<{
    modelValue: boolean
    product:    PosProductDto | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    add:                [item: PosCartItem]
}>()

const open     = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const quantity = ref(1)
const note     = ref('')

const selections  = ref<Map<number, Set<number>>>(new Map())
const groupErrors = ref<Record<number, string>>({})

watch(
    () => props.product,
    (product) => {
        quantity.value    = 1
        note.value        = ''
        groupErrors.value = {}
        const newMap      = new Map<number, Set<number>>()
        if (product) {
            for (const group of product.OptionGroups) {
                const set = new Set<number>()
                for (const opt of group.Options) {
                    if (opt.IsDefault && opt.IsAvailable) set.add(opt.Id)
                }
                newMap.set(group.GroupId, set)
            }
        }
        selections.value = newMap
    },
    { immediate: true },
)

function isSelected(groupId: number, optionId: number): boolean {
    return selections.value.get(groupId)?.has(optionId) ?? false
}

function toggleOption(group: PosOptionGroupDto, opt: PosOptionDto): void {
    const set = new Set(selections.value.get(group.GroupId) ?? [])
    if (group.UiType === 'SingleSelect') {
        set.clear()
        set.add(opt.Id)
    } else {
        if (set.has(opt.Id)) {
            set.delete(opt.Id)
        } else if (set.size < group.MaxSelect) {
            set.add(opt.Id)
        }
    }
    selections.value = new Map(selections.value).set(group.GroupId, set)
}

const selectedOptions = computed<PosCartOption[]>(() => {
    if (!props.product) return []
    const result: PosCartOption[] = []
    for (const group of props.product.OptionGroups) {
        const set = selections.value.get(group.GroupId) ?? new Set()
        for (const opt of group.Options) {
            if (set.has(opt.Id)) {
                result.push({
                    optionId:      opt.Id,
                    optionName:    opt.Name,
                    groupId:       group.GroupId,
                    resolvedPrice: opt.ResolvedPrice,
                })
            }
        }
    }
    return result
})

const lineTotal = computed(() => {
    if (!props.product) return 0
    const optSum = selectedOptions.value.reduce((s, o) => s + o.resolvedPrice, 0)
    return (props.product.ResolvedPrice + optSum) * quantity.value
})

const isValid = computed(() => {
    if (!props.product) return false
    for (const group of props.product.OptionGroups) {
        if (!group.IsRequired) continue
        const count = selections.value.get(group.GroupId)?.size ?? 0
        if (count < group.MinSelect) return false
    }
    return true
})

function validate(): boolean {
    if (!props.product) return false
    const errors: Record<number, string> = {}
    for (const group of props.product.OptionGroups) {
        if (!group.IsRequired) continue
        const count = selections.value.get(group.GroupId)?.size ?? 0
        if (count < group.MinSelect) {
            errors[group.GroupId] = `Vui lòng chọn ít nhất ${group.MinSelect} lựa chọn`
        }
    }
    groupErrors.value = errors
    return Object.keys(errors).length === 0
}

function confirm(): void {
    if (!validate() || !props.product) return
    const item: PosCartItem = {
        uid:             crypto.randomUUID(),
        productId:       props.product.Id,
        productName:     props.product.Name,
        resolvedPrice:   props.product.ResolvedPrice,
        quantity:        quantity.value,
        note:            note.value,
        selectedOptions: selectedOptions.value,
    }
    emit('add', item)
}
</script>
