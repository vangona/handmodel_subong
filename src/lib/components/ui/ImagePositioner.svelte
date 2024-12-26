<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;

    const dispatch = createEventDispatcher<{
        save: { positionX: number; positionY: number };
        cancel: void;
    }>();

    let isDragging = false;
    let container: HTMLDivElement;

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
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg max-w-2xl w-full">
        <div 
            bind:this={container}
            role="presentation"
            class="relative w-full h-96 overflow-hidden cursor-move"
            on:mousedown={() => isDragging = true}
            on:mousemove={handleMouseMove}
            on:mouseup={handleMouseUp}
            on:mouseleave={handleMouseUp}
        >
            <img 
                src={imageUrl} 
                alt="이미지 위치 조정"
                class="w-full h-full object-cover"
                style="object-position: {positionX}% {positionY}%"
            />
            <div 
                class="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style="left: {positionX}%; top: {positionY}%"
            />
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
            <button 
                class="btn btn-ghost"
                on:click={() => dispatch('cancel')}
            >
                취소
            </button>
            <button 
                class="btn btn-primary"
                on:click={() => dispatch('save', { positionX, positionY })}
            >
                저장
            </button>
        </div>
    </div>
</div> 