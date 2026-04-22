<template>
  <v-app>
    <!-- Decorative background -->
    <div class="auth-layout__bg" aria-hidden="true">
      <div class="auth-layout__blob auth-layout__blob--1" />
      <div class="auth-layout__blob auth-layout__blob--2" />
    </div>

    <v-main class="auth-layout__main">
      <v-container class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:py-12">
        <div class="auth-layout__content">
          <!-- Brand -->
          <div class="auth-layout__brand">
            <router-link to="/" class="auth-layout__logo"> Soli Tea </router-link>
          </div>

          <!-- Slot content (LoginForm, RegisterForm…) -->
          <slot />

          <!-- Footer links -->
          <p class="auth-layout__footer">
            <router-link to="/" class="text-medium-emphasis text-decoration-none text-body-2">
              ← Về trang chủ
            </router-link>
          </p>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-layout__bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.auth-layout__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.08;
}

.auth-layout__blob--1 {
  width: 500px;
  height: 500px;
  top: -120px;
  right: -80px;
  background: rgb(var(--v-theme-primary));
}

.auth-layout__blob--2 {
  width: 360px;
  height: 360px;
  bottom: -80px;
  left: -60px;
  background: rgb(var(--v-theme-secondary, var(--v-theme-primary)));
  opacity: 0.05;
}

.auth-layout__main {
  position: relative;
  z-index: 1;
}

.auth-layout__content {
  width: 100%;
  max-width: 480px;
}

.auth-layout__brand {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-layout__logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.auth-layout__footer {
  text-align: center;
  margin-top: 1.5rem;
}
</style>
