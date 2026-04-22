<template>
  <v-menu offset-y max-width="360">
    <template #activator="{ props }">
      <v-btn icon variant="text" v-bind="props">
        <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" overlap>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="flex items-center justify-between py-3">
        <span class="text-base font-semibold">Notifications</span>
        <v-btn v-if="unreadCount > 0" size="small" variant="text" @click="markAllAsRead">
          Mark all read
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-list v-if="notifications.length" max-height="400" class="py-0">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleClick(notification)"
          :class="{ 'bg-blue-50': !notification.read }"
        >
          <template #prepend>
            <v-avatar :color="notification.color" size="40">
              <v-icon size="20">{{ notification.icon }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="text-sm">
            {{ notification.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-xs mt-1">
            {{ notification.time }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <div v-else class="pa-8 text-center text-neutral-500">No notifications</div>

      <v-divider />

      <v-card-actions>
        <v-btn variant="text" block color="primary" @click="viewAll">
          View all notifications
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Notification {
  id: string
  title: string
  time: string
  icon: string
  color: string
  read: boolean
}

const router = useRouter()

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'New order received',
    time: '5 minutes ago',
    icon: 'mdi-shopping',
    color: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Server maintenance scheduled',
    time: '1 hour ago',
    icon: 'mdi-alert',
    color: 'warning',
    read: false,
  },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function handleClick(notification: Notification) {
  notification.read = true
  // Handle navigation or action
}

function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true))
}

function viewAll() {
  router.push('/notifications')
}
</script>
