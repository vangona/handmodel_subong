<script lang="ts">
    export let imageUrl: string;
    export let positionX: number = 50;
    export let positionY: number = 50;
    export let scale: number = 1;
    export let aspectRatio: '1:1' | '2:3' = '2:3';

    $: containerClass = aspectRatio === '1:1' 
        ? 'w-full pt-[100%]'  // 1:1 비율
        : 'w-full pt-[150%]';  // 2:3 비율
</script>

<div class="relative {containerClass}">
    <div class="absolute inset-0 overflow-hidden rounded-lg">
        <img 
            src={imageUrl} 
            alt="이미지 프리뷰" 
            class="w-full h-full object-cover"
            style="object-position: {positionX}% {positionY}%; transform: scale({scale})"
        />
    </div>
</div> 