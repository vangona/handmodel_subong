<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { Slider } from '$lib/components/ui/slider';
    import { onMount, onDestroy, tick } from 'svelte';

    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;
    export let scale: number = 1;
    export let aspectRatio: '1:1' | '2:3' | 'hero' = '2:3';

    const dispatch = createEventDispatcher<{
        save: { positionX: number; positionY: number; scale: number };
        cancel: void;
        preview: { positionX: number; positionY: number; scale: number };
    }>();

    let isDragging = false;
    let container: HTMLButtonElement;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 2.0;
    const SCALE_STEP = 0.1;

    let startX: number;
    let startY: number;
    let startPositionX: number;
    let startPositionY: number;

    $: containerClass = aspectRatio === '1:1' 
        ? 'w-[360px] h-[360px]'  // 1:1 비율
        : aspectRatio === '2:3'
            ? 'w-[360px] h-[540px]'  // 2:3 비율
            : 'w-[360px] h-[70vh]';  // hero 비율 (화면 높이의 70%에 맞춤)

    function handleGlobalMouseMove(e: MouseEvent) {
        if (!isDragging || !container) return;
        e.preventDefault();
        
        const rect = container.getBoundingClientRect();
        const deltaX = ((e.clientX - startX) / rect.width) * 100;
        const deltaY = ((e.clientY - startY) / rect.height) * 100;
        
        positionX = Math.max(0, Math.min(100, startPositionX + deltaX));
        positionY = Math.max(0, Math.min(100, startPositionY + deltaY));
        dispatch('preview', { positionX, positionY, scale });
    }

    function handleGlobalMouseUp() {
        isDragging = false;
    }

    function handleScaleChange(value: number) {
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
        dispatch('preview', { positionX, positionY, scale });
    }

    function resetToDefault() {
        positionX = 50;
        positionY = 50;
        scale = 1;
        dispatch('preview', { positionX, positionY, scale });
    }

    function handleMouseDown(e: MouseEvent) {
        e.preventDefault();
        isDragging = true;
        
        startX = e.clientX;
        startY = e.clientY;
        startPositionX = positionX;
        startPositionY = positionY;
    }

    function handleWheel(e: WheelEvent) {
        e.preventDefault();
        
        const delta = -e.deltaY * 0.01;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
        
        scale = newScale;
        dispatch('preview', { positionX, positionY, scale });
    }

    function handleTouchStart(e: TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startPositionX = positionX;
            startPositionY = positionY;
        }
    }

    function handleTouchMove(e: TouchEvent) {
        if (!isDragging || !container || e.touches.length !== 1) return;
        e.preventDefault();
        
        const rect = container.getBoundingClientRect();
        const deltaX = ((e.touches[0].clientX - startX) / rect.width) * 100;
        const deltaY = ((e.touches[0].clientY - startY) / rect.height) * 100;
        
        positionX = Math.max(0, Math.min(100, startPositionX + deltaX));
        positionY = Math.max(0, Math.min(100, startPositionY + deltaY));
    }

    function handleTouchEnd() {
        isDragging = false;
    }

    let initialDistance: number | null = null;
    let initialScale: number;

    function handleGestureStart(e: TouchEvent) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialScale = scale;
        }
    }

    function handleGestureMove(e: TouchEvent) {
        if (e.touches.length === 2 && initialDistance !== null) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const newScale = initialScale * (currentDistance / initialDistance);
            scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        }
    }

    function handleGestureEnd() {
        initialDistance = null;
    }

    let imageLoaded = false;
    async function handleImageLoad() {
        imageLoaded = true;
        await tick();
    }

    // 키보드 조작을 위한 스텝 크기
    const POSITION_STEP = 1;
    const SCALE_STEP_KEYBOARD = 0.05;

    function handleKeyDown(e: KeyboardEvent) {
        let updated = false;
        switch(e.key) {
            case 'ArrowLeft':
                positionX = Math.max(0, positionX - POSITION_STEP);
                updated = true;
                break;
            case 'ArrowRight':
                positionX = Math.min(100, positionX + POSITION_STEP);
                updated = true;
                break;
            case 'ArrowUp':
                positionY = Math.max(0, positionY - POSITION_STEP);
                updated = true;
                break;
            case 'ArrowDown':
                positionY = Math.min(100, positionY + POSITION_STEP);
                updated = true;
                break;
            case '+':
            case '=':
                if (e.ctrlKey || e.metaKey) {
                    scale = Math.min(MAX_SCALE, scale + SCALE_STEP_KEYBOARD);
                    updated = true;
                }
                break;
            case '-':
                if (e.ctrlKey || e.metaKey) {
                    scale = Math.max(MIN_SCALE, scale - SCALE_STEP_KEYBOARD);
                    updated = true;
                }
                break;
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    resetToDefault();
                    updated = true;
                }
                break;
            case 'Escape':
                dispatch('cancel');
                break;
            case 'Enter':
                if (e.ctrlKey || e.metaKey) {
                    dispatch('save', { positionX, positionY, scale });
                }
                break;
        }
        if (updated) {
            dispatch('preview', { positionX, positionY, scale });
        }
    }

    onMount(() => {
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('gesturestart', handleGestureStart as any, { passive: false });
        container.addEventListener('gesturechange', handleGestureMove as any, { passive: false });
        container.addEventListener('gestureend', handleGestureEnd as any);
    });

    onDestroy(() => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        container?.removeEventListener('wheel', handleWheel);
        container?.removeEventListener('touchstart', handleTouchStart);
        container?.removeEventListener('touchmove', handleTouchMove);
        container?.removeEventListener('touchend', handleTouchEnd);
        container?.removeEventListener('gesturestart', handleGestureStart as any);
        container?.removeEventListener('gesturechange', handleGestureMove as any);
        container?.removeEventListener('gestureend', handleGestureEnd as any);
    });
</script>

<div class="flex flex-col gap-4">
    <div class="sr-only">
        <p>방향키로 이미지 위치를 조정할 수 있습니다.</p>
        <p>Ctrl + '+' 또는 '-'로 크기를 조정할 수 있습니다.</p>
        <p>Ctrl + R로 초기화할 수 있습니다.</p>
        <p>Ctrl + Enter로 저장, ESC로 취소할 수 있습니다.</p>
    </div>

    <button 
        bind:this={container}
        type="button"
        aria-label="이미지 위치 조정 영역"
        class="relative overflow-hidden cursor-move select-none {containerClass}"
        class:opacity-50={!imageLoaded}
        on:mousedown={handleMouseDown}
        on:keydown={handleKeyDown}
    >
        <img 
            src={imageUrl} 
            alt="이미지 위치 조정"
            class="w-full h-full object-cover transition-transform"
            style="object-position: {positionX}% {positionY}%; transform: scale({scale})"
            on:load={handleImageLoad}
            aria-hidden="true"
        />
        {#if imageLoaded}
            <div 
                class="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white cursor-move"
                style="left: {positionX}%; top: {positionY}%"
                aria-hidden="true"
            />
        {/if}
    </button>

    <div class="space-y-4">
        <div class="flex items-center gap-4">
            <label for="scale-slider" class="text-sm font-medium">크기 조정:</label>
            <Slider
                id="scale-slider"
                class="w-[60%]"
                value={[scale]}
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={SCALE_STEP}
                onValueChange={([value]) => handleScaleChange(value)}
                aria-valuemin={MIN_SCALE}
                aria-valuemax={MAX_SCALE}
                aria-valuenow={scale}
            />
            <span class="text-sm" aria-live="polite">{(scale * 100).toFixed(0)}%</span>
        </div>
    </div>
    
    <div class="flex justify-between">
        <Button 
            variant="outline" 
            on:click={resetToDefault}
            aria-label="초기화"
        >
            초기화
        </Button>
        <div class="flex gap-2">
            <Button 
                variant="ghost" 
                on:click={() => dispatch('cancel')}
                aria-label="취소"
            >
                취소
            </Button>
            <Button 
                variant="default" 
                on:click={() => dispatch('save', { positionX, positionY, scale })}
                aria-label="저장"
            >
                저장
            </Button>
        </div>
    </div>
</div> 