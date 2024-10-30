<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let imageUrl: string;
    export let positionX = 50;
    export let positionY = 50;

    const dispatch = createEventDispatcher<{
        save: { positionX: number; positionY: number };
        cancel: void;
    }>();

    let isDragging = false;
    let container: HTMLDivElement;
    let startX = 0;
    let startY = 0;
    let initialPositionX = positionX;
    let initialPositionY = positionY;

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialPositionX = positionX;
        initialPositionY = positionY;
        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging || !container) return;

        const rect = container.getBoundingClientRect();
        const deltaX = ((event.clientX - startX) / rect.width) * 100;
        const deltaY = ((event.clientY - startY) / rect.height) * 100;

        positionX = Math.max(0, Math.min(100, initialPositionX - deltaX));
        positionY = Math.max(0, Math.min(100, initialPositionY - deltaY));
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleSave() {
        dispatch('save', { positionX, positionY });
    }

    function handleCancel() {
        dispatch('cancel');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white p-4 rounded-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">이미지 위치 조정</h2>
        <div 
            role="presentation"
            bind:this={container}
            class="relative aspect-[9/16] mb-4 cursor-move overflow-hidden rounded-lg max-h-[70vh] mx-auto"
            style="max-width: min(400px, 100%)"
            on:mousedown={handleMouseDown}
            on:mousemove={handleMouseMove}
            on:mouseup={handleMouseUp}
            on:mouseleave={handleMouseUp}
        >
            <img
                src={imageUrl}
                alt="이미지 위치 조정"
                class="absolute w-full h-full object-cover select-none"
                style="object-position: {positionX}% {positionY}%"
                draggable="false"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10">
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-8 h-8 border-2 border-white rounded-full bg-black bg-opacity-50" />
                </div>
            </div>
        </div>
        <p class="text-sm text-gray-500 mb-4">이미지를 드래그하여 위치를 조정하세요.</p>
        <div class="flex justify-end gap-2">
            <button class="btn btn-ghost" on:click={handleCancel}>취소</button>
            <button class="btn btn-primary" on:click={handleSave}>적용</button>
        </div>
    </div>
</div>

<style>
    img {
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style> 