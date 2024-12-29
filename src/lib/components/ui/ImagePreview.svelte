<script lang="ts">
    type PreviewMode = 'preview' | 'edit' | 'display';
    type Size = `${number}${string}` | number;

    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;
    export let scale: number = 1;
    export let aspectRatio: '1:1' | '2:3' | 'hero' | 'hero-mobile' = '2:3';
    export let mode: PreviewMode = 'display';
    export let width: Size = '100%';
    export let height: Size | null = null;

    $: widthStyle = typeof width === 'number' ? `${width}px` : width;
    $: heightStyle = height 
        ? (typeof height === 'number' ? `${height}px` : height)
        : null;

    $: containerClass = heightStyle 
        ? '' 
        : aspectRatio === '1:1'
            ? 'pt-[100%]'  // 1:1 비율
            : aspectRatio === '2:3'
                ? 'pt-[150%]'  // 2:3 비율
                : aspectRatio === 'hero'
                    ? 'h-screen'  // PC hero 비율 (화면 높이에 맞춤)
                    : 'pt-[177.78%]';  // 모바일 hero 비율 (9:16 = 56.25% : 100%)

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
</script>

<div 
    class="relative {containerClass}"
    role={mode === 'display' ? 'img' : 'button'}
    aria-label={ariaLabel}
    style="width: {widthStyle}; {heightStyle ? `height: ${heightStyle}` : ''}"
>
    <div class="absolute inset-0 overflow-hidden rounded-lg {previewClass}">
        <img 
            src={imageUrl} 
            alt="이미지 프리뷰" 
            class="w-full h-full object-cover"
            style="transform: translate(-50%, -50%) scale({scale}); position: absolute; top: {positionY}%; left: {positionX}%;"
        />
    </div>
</div> 