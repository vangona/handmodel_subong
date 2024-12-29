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
    let container: HTMLDivElement;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3.0;
    const SCALE_STEP = 0.01;

    let startX: number;
    let startY: number;
    let startPositionX: number;
    let startPositionY: number;

    $: containerClass = aspectRatio === '1:1' 
        ? 'w-[360px] h-[360px]'  // 1:1 비율
        : aspectRatio === '2:3'
            ? 'w-[360px] h-[540px]'  // 2:3 비율
            : 'w-[360px] h-[calc(100vh-2rem)]';  // hero 비율 (화면 높이에 맞춤)

    function handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startPositionX = positionX;
        startPositionY = positionY;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        event.preventDefault();

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const rect = container.getBoundingClientRect();

        // 이동 거리를 퍼센트로 변환 (반대 방향으로 이동)
        const percentX = -(deltaX / rect.width) * 100;
        const percentY = -(deltaY / rect.height) * 100;

        // 위치 업데이트
        positionX = Math.max(0, Math.min(100, startPositionX - percentX));
        positionY = Math.max(0, Math.min(100, startPositionY - percentY));

        // 미리보기 이벤트 발생
        dispatch('preview', { positionX, positionY, scale });
    }

    function handleMouseUp(event: MouseEvent) {
        if (isDragging) {
            event.preventDefault();
            isDragging = false;
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        const STEP = 1;
        const SCALE_KEY_STEP = 0.01;
        let updated = false;

        switch (event.key) {
            case 'ArrowLeft':
                positionX = Math.max(0, positionX - STEP);
                updated = true;
                break;
            case 'ArrowRight':
                positionX = Math.min(100, positionX + STEP);
                updated = true;
                break;
            case 'ArrowUp':
                if (event.shiftKey) {
                    scale = Math.min(MAX_SCALE, Math.round((scale + SCALE_KEY_STEP) * 100) / 100);
                    updated = true;
                } else {
                    positionY = Math.max(0, positionY - STEP);
                    updated = true;
                }
                break;
            case 'ArrowDown':
                if (event.shiftKey) {
                    scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_KEY_STEP) * 100) / 100);
                    updated = true;
                } else {
                    positionY = Math.min(100, positionY + STEP);
                    updated = true;
                }
                break;
        }

        if (updated) {
            event.preventDefault();
            dispatch('preview', { positionX, positionY, scale });
        }
    }

    function handleScaleChange(value: number[]) {
        scale = Math.round(value[0] * 100) / 100;
        dispatch('preview', { positionX, positionY, scale });
    }

    function handleSave() {
        dispatch('save', { positionX, positionY, scale });
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleReset() {
        positionX = 50;
        positionY = 50;
        scale = 1;
        dispatch('preview', { positionX, positionY, scale });
    }

    onMount(() => {
        if (container) {
            container.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    });

    onDestroy(() => {
        if (container) {
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    });
</script>

<div class="flex flex-col gap-4">
    <div class="sr-only">
        <p>방향키로 이미지 위치를 조정할 수 있습니다.</p>
        <p>크기는 슬라이더를 사용하여 조정할 수 있습니다.</p>
    </div>

    <div class="relative {containerClass} bg-gray-100 rounded-lg overflow-hidden">
        <div
            bind:this={container}
            class="absolute inset-0 cursor-move"
            role="button"
            tabindex="0"
            aria-label="이미지 위치 조정. 마우스로 드래그하거나 방향키로 조정하세요."
            on:keydown={handleKeyDown}
        >
            <div class="absolute inset-0 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt="이미지 위치 조정" 
                    class="w-full h-full object-cover select-none"
                    style="transform: translate(-50%, -50%) scale({scale}); position: absolute; top: {positionY}%; left: {positionX}%;"
                    draggable="false"
                    aria-hidden="true"
                />
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-2">
        <label for="scale-slider" class="text-sm font-medium text-gray-700">크기 조정</label>
        <Slider
            id="scale-slider"
            value={[scale]}
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={SCALE_STEP}
            onValueChange={handleScaleChange}
            aria-label="이미지 크기 조정"
            aria-valuemin={MIN_SCALE}
            aria-valuemax={MAX_SCALE}
            aria-valuenow={scale}
        />
        <div class="text-sm text-gray-500 text-center" aria-live="polite">
            {Math.round(scale * 100)}%
        </div>
    </div>

    <div class="flex justify-between gap-2">
        <Button 
            variant="outline" 
            on:click={handleReset}
            aria-label="이미지 위치와 크기를 기본값으로 초기화"
        >
            초기화
        </Button>
        <div class="flex gap-2">
            <Button 
                variant="outline" 
                on:click={handleCancel}
                aria-label="변경 사항 취소"
            >
                취소
            </Button>
            <Button 
                on:click={handleSave}
                aria-label="변경된 이미지 위치와 크기 저장"
            >
                저장
            </Button>
        </div>
    </div>
</div> 