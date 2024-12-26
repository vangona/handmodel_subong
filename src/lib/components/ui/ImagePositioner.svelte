<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { Slider } from '$lib/components/ui/slider';

    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;
    export let scale: number = 1;

    const dispatch = createEventDispatcher<{
        save: { positionX: number; positionY: number; scale: number };
        cancel: void;
    }>();

    let isDragging = false;
    let container: HTMLButtonElement;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 2.0;
    const SCALE_STEP = 0.1;

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging || !container) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        positionX = Math.max(0, Math.min(100, x));
        positionY = Math.max(0, Math.min(100, y));
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleKeyDown(e: KeyboardEvent) {
        const STEP = 1;
        switch(e.key) {
            case 'ArrowLeft':
                positionX = Math.max(0, positionX - STEP);
                break;
            case 'ArrowRight':
                positionX = Math.min(100, positionX + STEP);
                break;
            case 'ArrowUp':
                positionY = Math.max(0, positionY - STEP);
                break;
            case 'ArrowDown':
                positionY = Math.min(100, positionY + STEP);
                break;
        }
    }

    function handleScaleChange(value: number) {
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
    }

    function resetToDefault() {
        positionX = 50;
        positionY = 50;
        scale = 1;
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg max-w-2xl w-full">
        <button 
            bind:this={container}
            aria-label="이미지 위치 조정"
            class="relative w-full h-96 overflow-hidden cursor-move"
            on:mousedown={() => isDragging = true}
            on:mousemove={handleMouseMove}
            on:mouseup={handleMouseUp}
            on:mouseleave={handleMouseUp}
            on:keydown={handleKeyDown}
        >
            <img 
                src={imageUrl} 
                alt="이미지 위치 조정"
                class="w-full h-full object-cover transition-transform"
                style="object-position: {positionX}% {positionY}%; transform: scale({scale})"
            />
            <div 
                class="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white cursor-move"
                style="left: {positionX}%; top: {positionY}%"
            />
        </button>

        <div class="mt-4 space-y-4">
            <div class="flex items-center gap-4">
                <span class="text-sm font-medium">크기 조정:</span>
                <Slider
                    class="w-[60%]"
                    value={[scale]}
                    min={MIN_SCALE}
                    max={MAX_SCALE}
                    step={SCALE_STEP}
                    onValueChange={([value]) => handleScaleChange(value)}
                />
                <span class="text-sm">{(scale * 100).toFixed(0)}%</span>
            </div>
        </div>
        
        <div class="flex justify-between mt-4">
            <Button variant="outline" on:click={resetToDefault}>
                초기화
            </Button>
            <div class="flex gap-2">
                <Button variant="ghost" on:click={() => dispatch('cancel')}>
                    취소
                </Button>
                <Button variant="default" on:click={() => dispatch('save', { positionX, positionY, scale })}>
                    저장
                </Button>
            </div>
        </div>
    </div>
</div> 