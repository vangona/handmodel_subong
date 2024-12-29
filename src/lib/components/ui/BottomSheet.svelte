<!-- 바텀 시트 컴포넌트 -->
<script lang="ts">
    import { spring } from 'svelte/motion';
    import { fade } from 'svelte/transition';

    export let isOpen = false;
    export let onClose: () => void;
    export let minHeight = 200;
    export let snapPoints = [0.4, 0.8, 1]; // 높이 비율 (40%, 80%, 100%)

    let touchStartY = 0;
    let initialHeight: number;
    let containerHeight: number;
    let isDragging = false;
    let currentSnapIndex = 0;

    const height = spring(snapPoints[0], {
        stiffness: 0.2,
        damping: 0.8
    });

    function handleTouchStart(event: TouchEvent) {
        touchStartY = event.touches[0].clientY;
        initialHeight = $height;
        isDragging = true;
    }

    function handleTouchMove(event: TouchEvent) {
        if (!isDragging) return;

        const deltaY = event.touches[0].clientY - touchStartY;
        const newHeight = Math.max(0, Math.min(1, initialHeight - deltaY / containerHeight));
        height.set(newHeight, { hard: true });
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;

        // 가장 가까운 스냅 포인트 찾기
        const closest = snapPoints.reduce((prev, curr) => {
            return Math.abs(curr - $height) < Math.abs(prev - $height) ? curr : prev;
        });

        // 스냅 포인트로 애니메이션
        if ($height < 0.2) {
            onClose();
        } else {
            height.set(closest, { hard: false });
            currentSnapIndex = snapPoints.indexOf(closest);
        }
    }

    $: if (!isOpen) {
        height.set(0);
    } else if (!isDragging) {
        height.set(snapPoints[currentSnapIndex]);
    }
</script>

{#if isOpen}
    <div 
        class="fixed inset-0 z-50 md:hidden"
        transition:fade={{ duration: 200 }}
    >
        <!-- 배경 오버레이 -->
        <button 
            type="button"
            class="absolute inset-0 bg-black/50 backdrop-blur-sm border-0"
            style="opacity: {$height * 0.5}"
            on:click={onClose}
        />

        <!-- 바텀 시트 -->
        <div
            class="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl overflow-hidden touch-none"
            style="height: {Math.max(minHeight, $height * 100)}vh; transform: translateY({(1 - $height) * 30}%);"
            bind:clientHeight={containerHeight}
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
            on:touchend={handleTouchEnd}
        >
            <!-- 드래그 핸들 -->
            <div class="absolute inset-x-0 top-0 h-8 flex items-center justify-center">
                <div class="w-12 h-1 rounded-full bg-gray-300" />
            </div>

            <!-- 컨텐츠 -->
            <div class="h-full pt-8 overflow-y-auto overscroll-contain">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style>
    /* iOS 오버스크롤 방지 */
    :global(body) {
        overscroll-behavior-y: contain;
    }
</style> 