<script lang="ts">
	import { supabase } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user = null;

	onMount(async () => {
		const user = await supabase.auth.getUser();
		if (!user) {
			goto('/admin/login');
		}
	});
</script>

<slot />

<style>
	/* 스타일을 필요에 따라 추가하세요 */
</style>