<script lang="ts">
    import { spring } from 'svelte/motion';

    type PreviewMode = 'preview' | 'edit' | 'display';
    type Size = `${number}${string}` | number;
    type AspectRatio = '1:1' | '2:3' | 'hero' | 'hero-mobile';

    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;
    export let scale: number = 1;
    export let aspectRatio: AspectRatio = '2:3';
    export let mode: PreviewMode = 'display';
    export let width: Size = '100%';
    export let height: Size | null = null;
    export let isZoomed = false;

    let container: HTMLDivElement;
    let isLoading = true;
    let isError = false;
    let loadedUrl = '';

    // 이미지 프리로딩
    async function preloadImage(url: string) {
        if (url === loadedUrl) return;
        isLoading = true;
        isError = false;

        try {
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
            loadedUrl = url;
        } catch (error) {
            isError = true;
            console.error('이미지 로딩 실패:', error);
        } finally {
            isLoading = false;
        }
    }

    $: {
        if (imageUrl) {
            preloadImage(imageUrl);
        }
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startPositionX = 0;
    let startPositionY = 0;
    let lastTapTime = 0;
    let initialPinchDistance = 0;

    const currentScale = spring(1, {
        stiffness: 0.2,
        damping: 0.8
    });

    const currentX = spring(0, {
        stiffness: 0.2,
        damping: 0.8
    });

    const currentY = spring(0, {
        stiffness: 0.2,
        damping: 0.8
    });

    function handleTouchStart(event: TouchEvent) {
        if (event.touches.length === 2) {
            // 핀치 줌 시작
            initialPinchDistance = getPinchDistance(event.touches);
            isDragging = false;
        } else {
            const now = Date.now();
            if (now - lastTapTime < 300) {
                // 더블 탭
                handleDoubleTap(event);
            }
            lastTapTime = now;

            // 일반 드래그 시작
            isDragging = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            startPositionX = $currentX;
            startPositionY = $currentY;
        }
    }

    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length === 2) {
            // 핀치 줌
            const currentDistance = getPinchDistance(event.touches);
            const scaleFactor = currentDistance / initialPinchDistance;
            const newScale = Math.max(1, Math.min(3, scaleFactor));
            currentScale.set(newScale);
        } else if (isDragging && $currentScale > 1) {
            // 확대된 상태에서만 드래그 가능
            const deltaX = event.touches[0].clientX - startX;
            const deltaY = event.touches[0].clientY - startY;
            const maxOffset = 100 * ($currentScale - 1);
            
            currentX.set(
                Math.max(-maxOffset, Math.min(maxOffset, startPositionX + deltaX))
            );
            currentY.set(
                Math.max(-maxOffset, Math.min(maxOffset, startPositionY + deltaY))
            );
        }
    }

    function handleTouchEnd() {
        isDragging = false;
        if ($currentScale <= 1) {
            // 원래 크기로 돌아왔을 때 위치도 초기화
            currentX.set(0);
            currentY.set(0);
        }
    }

    function handleDoubleTap(event: TouchEvent) {
        if ($currentScale > 1) {
            // 줌 아웃
            currentScale.set(1);
            currentX.set(0);
            currentY.set(0);
        } else {
            // 줌 인 (탭한 위치 중심으로)
            const rect = container.getBoundingClientRect();
            const x = event.touches[0].clientX - rect.left;
            const y = event.touches[0].clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            currentScale.set(2);
            currentX.set((centerX - x) * 2);
            currentY.set((centerY - y) * 2);
        }
    }

    function getPinchDistance(touches: TouchList) {
        const dx = touches[1].clientX - touches[0].clientX;
        const dy = touches[1].clientY - touches[0].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 마우스 이벤트 핸들러 추가
    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
            // 확대/축소
            const delta = -event.deltaY;
            const scaleFactor = Math.pow(1.1, delta / 100);
            const newScale = Math.max(1, Math.min(3, $currentScale * scaleFactor));
            currentScale.set(newScale);

            if (newScale <= 1) {
                currentX.set(0);
                currentY.set(0);
            }
        }
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button !== 0) return; // 좌클릭만 처리

        const now = Date.now();
        if (now - lastTapTime < 300) {
            // 더블 클릭
            handleDoubleClick(event);
        }
        lastTapTime = now;

        if ($currentScale > 1) {
            // 드래그 시작
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            startPositionX = $currentX;
            startPositionY = $currentY;
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging || $currentScale <= 1) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const maxOffset = 100 * ($currentScale - 1);
        
        currentX.set(
            Math.max(-maxOffset, Math.min(maxOffset, startPositionX + deltaX))
        );
        currentY.set(
            Math.max(-maxOffset, Math.min(maxOffset, startPositionY + deltaY))
        );
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleDoubleClick(event: MouseEvent) {
        if ($currentScale > 1) {
            // 줌 아웃
            currentScale.set(1);
            currentX.set(0);
            currentY.set(0);
        } else {
            // 줌 인 (클릭한 위치 중심으로)
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            currentScale.set(2);
            currentX.set((centerX - x) * 2);
            currentY.set((centerY - y) * 2);
        }
    }

    $: widthStyle = typeof width === 'number' ? `${width}px` : width;
    $: heightStyle = height 
        ? (typeof height === 'number' ? `${height}px` : height)
        : null;

    $: containerClass = {
        '1:1': 'aspect-square',
        '2:3': 'aspect-[2/3]',
        'hero': mode === 'preview' ? 'h-full' : 'h-full',
        'hero-mobile': 'aspect-[9/16]'
    }[aspectRatio];

    $: previewClass = mode === 'preview' 
        ? 'cursor-move hover:ring-2 hover:ring-blue-500 transition-all duration-200'
        : mode === 'edit'
            ? 'cursor-move'
            : '';

    $: ariaLabel = mode === 'preview' 
        ? '이미지 위치 및 크기 프리뷰'
        : mode === 'edit'
            ? '이미지 위치 및 크기 조정'
            : '이미지';

    $: imageStyle = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(${scale * $currentScale}) translate(${$currentX}px, ${$currentY}px);
        object-position: ${positionX}% ${positionY}%;
    `;

    $: isZoomed = $currentScale > 1;
</script>

<div 
    class="relative {containerClass}"
    role={mode === 'display' ? 'img' : 'button'}
    aria-label={ariaLabel}
    style="width: {widthStyle}; {heightStyle ? `height: ${heightStyle}` : ''}"
    bind:this={container}
    on:wheel|preventDefault={handleWheel}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
>
    <div class="absolute inset-0 overflow-hidden rounded-lg {previewClass}">
        {#if isLoading}
            <div class="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        {:else if isError}
            <div class="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div class="text-gray-500 text-center">
                    <svg class="w-8 h-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-sm">이미지를 불러올 수 없습니다</p>
                </div>
            </div>
        {/if}
        <img 
            src={imageUrl} 
            alt="이미지 프리뷰" 
            class="w-full h-full object-cover absolute top-1/2 left-1/2 transition-opacity duration-300"
            class:opacity-0={isLoading || isError}
            style="transform: translate(-50%, -50%) scale({scale * $currentScale}) translate({$currentX}px, {$currentY}px); object-position: {positionX}% {positionY}%;"
        />
    </div>
</div> 