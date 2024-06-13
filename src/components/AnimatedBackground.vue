<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div class="absolute inset-0" style="background: var(--bg-base)" />

    <!-- Animated mesh gradient orbs -->
    <div
      class="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[100px] animate-mesh"
      style="background: radial-gradient(circle, var(--accent) 0%, transparent 70%); top: -10%; left: -10%; animation: mesh-drift 20s ease-in-out infinite;"
    />
    <div
      class="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[90px]"
      style="background: radial-gradient(circle, var(--gold) 0%, transparent 70%); bottom: -5%; right: -5%; animation: mesh-drift 25s ease-in-out infinite reverse;"
    />
    <div
      class="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] animate-float"
      style="background: radial-gradient(circle, #6366f1 0%, transparent 70%); top: 40%; left: 50%;"
    />

    <!-- Floating particles -->
    <div
      v-for="i in 20"
      :key="i"
      class="absolute rounded-full animate-float-slow"
      :style="{
        width: `${2 + (i % 4)}px`,
        height: `${2 + (i % 4)}px`,
        background: i % 3 === 0 ? 'var(--gold)' : 'var(--accent)',
        opacity: 0.15 + (i % 5) * 0.08,
        top: `${(i * 17 + 5) % 95}%`,
        left: `${(i * 23 + 3) % 95}%`,
        animationDelay: `${i * 0.4}s`,
        animationDuration: `${10 + (i % 8)}s`,
      }"
    />

    <!-- Subtle grid overlay -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="background-image: linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px); background-size: 60px 60px;"
    />

    <!-- Noise texture overlay -->
    <div class="absolute inset-0 opacity-[0.015]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');" />
  </div>
</template>
