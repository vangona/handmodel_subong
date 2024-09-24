<script lang="ts">
	export let position: 'left' | 'right';
</script>

<div class={`sticky top-0 hidden h-dvh flex-grow items-center justify-center bg-slate-300 ${position === 'left' ? 'md:flex' : 'sm:flex'}`}>
	<p>test</p>
</div>