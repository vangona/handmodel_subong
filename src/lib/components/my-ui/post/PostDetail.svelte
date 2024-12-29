<script lang="ts">
    import type { PostTable } from '$lib/api/supabaseClient';
    import { fade, fly, blur, slide } from 'svelte/transition';
    import ImagePreview from '$lib/components/ui/ImagePreview.svelte';
    import { goto } from '$app/navigation';
    import { spring } from 'svelte/motion';

    export let post: PostTable;
    export let posts: PostTable[];
    export let onClose: () => void;

    let showInfo = true;
    let touchStartY = 0;
    let touchStartX = 0;
    let currentImageIndex = 0;
    let infoHeight = 0;
    let isDragging = false;
    let dragStartX = 0;
    let showPrevPreview = false;
    let showNextPreview = false;
    let dragAmount = spring(0, {
        stiffness: 0.1,
        damping: 0.4
    });

    // 현재 게시글의 인덱스 찾기
    $: currentIndex = posts.findIndex(p => p.id === post.id);
    $: prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    $: nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
    $: hasMultipleImages = post.images && post.images.length > 1;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            if (event.shiftKey && hasMultipleImages) {
                navigateImage(-1);
            } else if (prevPost) {
                navigateToPost(prevPost.id);
            }
        } else if (event.key === 'ArrowRight') {
            if (event.shiftKey && hasMultipleImages) {
                navigateImage(1);
            } else if (nextPost) {
                navigateToPost(nextPost.id);
            }
        }
    }

    function navigateToPost(postId: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('post', postId.toString());
        goto(url.toString(), { replaceState: false });
        currentImageIndex = 0;
    }

    function navigateImage(direction: number) {
        if (!post.images) return;
        currentImageIndex = (currentImageIndex + direction + post.images.length) % post.images.length;
    }

    function selectImage(index: number) {
        currentImageIndex = index;
    }

    function handleTouchStart(event: TouchEvent) {
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
        dragStartX = touchStartX;
        isDragging = true;
    }

    function handleTouchMove(event: TouchEvent) {
        if (!isDragging) return;

        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;
        
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 50) {
                showInfo = false;
            } else if (deltaY < -50) {
                showInfo = true;
            }
        } 
        else {
            dragAmount.set(deltaX);
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        if (!isDragging) return;
        isDragging = false;

        const deltaX = event.changedTouches[0].clientX - dragStartX;
        dragAmount.set(0);

        if (Math.abs(deltaX) > 200) {
            if (deltaX > 0 && prevPost) {
                navigateToPost(prevPost.id);
            } else if (deltaX < 0 && nextPost) {
                navigateToPost(nextPost.id);
            }
        }
    }

    function handleMouseDown(event: MouseEvent) {
        dragStartX = event.clientX;
        touchStartX = event.clientX;
        touchStartY = event.clientY;
        isDragging = true;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;

        const currentX = event.clientX;
        const currentY = event.clientY;
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;
        
        // 수직 스와이프가 더 크면 정보 표시/숨김
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 50) {
                showInfo = false;
            } else if (deltaY < -50) {
                showInfo = true;
            }
        } 
        // 수평 스와이프
        else {
            dragAmount.set(deltaX);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (!isDragging) return;
        isDragging = false;

        const deltaX = event.clientX - dragStartX;
        dragAmount.set(0);

        if (Math.abs(deltaX) > 200) {
            if (deltaX > 0 && prevPost) {
                navigateToPost(prevPost.id);
            } else if (deltaX < 0 && nextPost) {
                navigateToPost(nextPost.id);
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 to-black"
    transition:fade={{ duration: 300 }}
>
    {#if post.images && post.images.length > 0}
        <div 
            class="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30 blur-2xl scale-110"
            style="background-image: url({post.images[currentImageIndex]})"
            transition:blur={{ duration: 300 }}
        />
    {/if}

    <button
        class="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all z-50 backdrop-blur-sm"
        on:click={onClose}
        aria-label="닫기"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>

    <div 
        class="relative w-full h-full flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-title"
        on:mouseenter={() => showInfo = true}
        on:mouseleave={() => showInfo = false}
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
    >
        {#if prevPost}
            <div class="absolute left-4 top-1/2 -translate-y-1/2 group z-50">
                <button
                    class="relative p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all backdrop-blur-sm hidden md:block"
                    on:click={() => navigateToPost(prevPost.id)}
                    aria-label="이전 게시글"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div 
                    class="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center gap-2 pointer-events-none"
                    role="complementary"
                >
                    <div 
                        class="w-16 h-16 rounded-lg overflow-hidden border border-white/20 backdrop-blur-sm bg-black/30"
                    >
                        {#if prevPost.images && prevPost.images.length > 0}
                            <ImagePreview
                                imageUrl={prevPost.images[0]}
                                positionX={prevPost.thumbnail_position_x ?? 50}
                                positionY={prevPost.thumbnail_position_y ?? 50}
                                scale={prevPost.thumbnail_scale ?? 1}
                                aspectRatio="1:1"
                                mode="display"
                            />
                        {/if}
                    </div>
                    <span class="text-sm font-medium text-white whitespace-nowrap">이전</span>
                </div>
            </div>
        {/if}

        {#if nextPost}
            <div class="absolute right-4 top-1/2 -translate-y-1/2 group z-50">
                <button
                    class="relative p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all backdrop-blur-sm hidden md:block"
                    on:click={() => navigateToPost(nextPost.id)}
                    aria-label="다음 게시글"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div 
                    class="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center gap-2 pointer-events-none"
                    role="complementary"
                >
                    <span class="text-sm font-medium text-white whitespace-nowrap">다음</span>
                    <div 
                        class="w-16 h-16 rounded-lg overflow-hidden border border-white/20 backdrop-blur-sm bg-black/30"
                    >
                        {#if nextPost.images && nextPost.images.length > 0}
                            <ImagePreview
                                imageUrl={nextPost.images[0]}
                                positionX={nextPost.thumbnail_position_x ?? 50}
                                positionY={nextPost.thumbnail_position_y ?? 50}
                                scale={nextPost.thumbnail_scale ?? 1}
                                aspectRatio="1:1"
                                mode="display"
                            />
                        {/if}
                    </div>
                </div>
            </div>
        {/if}

        {#if post.images && post.images.length > 0}
            <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                role="presentation"
                on:touchstart|preventDefault={handleTouchStart}
                on:touchmove|preventDefault={handleTouchMove}
                on:touchend|preventDefault={handleTouchEnd}
                on:mousedown|preventDefault={handleMouseDown}
                on:mousemove|preventDefault={handleMouseMove}
                on:mouseup|preventDefault={handleMouseUp}
                on:mouseleave|preventDefault={handleMouseUp}
            >
                <div 
                    class="relative w-full h-full flex items-center justify-center" 
                    style="max-width: min(90vw, calc(90vh * 1.5)); max-height: min(90vh, calc(90vw / 1.5));"
                >
                    <div class="absolute inset-0 image-container select-none">
                        {#key currentImageIndex}
                            <div 
                                class="relative w-full h-full"
                                style="transform: translateX({$dragAmount}px);"
                                in:fade={{ duration: 150 }}
                                out:fade={{ duration: 150 }}
                            >
                                <ImagePreview
                                    imageUrl={post.images[currentImageIndex]}
                                    positionX={currentImageIndex === 0 ? (post.thumbnail_position_x ?? 50) : 50}
                                    positionY={currentImageIndex === 0 ? (post.thumbnail_position_y ?? 50) : 50}
                                    scale={currentImageIndex === 0 ? (post.thumbnail_scale ?? 1) : 1}
                                    aspectRatio="hero"
                                    mode="display"
                                />
                            </div>
                        {/key}
                        {#if isDragging}
                            <div 
                                class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/20 to-transparent"
                                style="opacity: {Math.max(0, -$dragAmount / 100)}"
                            >
                                {#if prevPost}
                                    <div class="absolute inset-0 flex items-center justify-center text-white/60 font-medium">
                                        이전 게시글
                                    </div>
                                {/if}
                            </div>
                            <div 
                                class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/20 to-transparent"
                                style="opacity: {Math.max(0, $dragAmount / 100)}"
                            >
                                {#if nextPost}
                                    <div class="absolute inset-0 flex items-center justify-center text-white/60 font-medium">
                                        다음 게시글
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}

        <div 
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-8 px-6 transform transition-transform duration-300 backdrop-blur-sm"
            class:translate-y-full={!showInfo}
            bind:clientHeight={infoHeight}
            style="--info-height: {infoHeight}px"
            in:fly={{ y: 100, duration: 300 }}
        >
            {#if hasMultipleImages}
                <div class="max-w-4xl mx-auto mb-6">
                    <div class="flex flex-col items-center gap-4">
                        <div class="flex gap-3 items-center">
                            {#each post.images as _, i}
                                <button
                                    class="group relative"
                                    on:click={() => selectImage(i)}
                                    aria-label={`이미지 ${i + 1}`}
                                >
                                    <div 
                                        class={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:opacity-100 ${
                                            i === currentImageIndex ? 'border-white' : 'border-white/20 opacity-40'
                                        }`}
                                    >
                                        <ImagePreview
                                            imageUrl={post.images[i]}
                                            positionX={i === 0 ? (post.thumbnail_position_x ?? 50) : 50}
                                            positionY={i === 0 ? (post.thumbnail_position_y ?? 50) : 50}
                                            scale={i === 0 ? (post.thumbnail_scale ?? 1) : 1}
                                            aspectRatio="1:1"
                                            mode="display"
                                        />
                                    </div>
                                </button>
                            {/each}
                        </div>
                        <div class="flex items-center gap-2 text-white/60 text-sm">
                            <button
                                class="p-2 rounded-full hover:bg-white/10 transition-colors"
                                on:click={() => navigateImage(-1)}
                                aria-label="이전 이미지 (Shift + ←)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span>{currentImageIndex + 1} / {post.images.length}</span>
                            <button
                                class="p-2 rounded-full hover:bg-white/10 transition-colors"
                                on:click={() => navigateImage(1)}
                                aria-label="다음 이미지 (Shift + →)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="max-w-4xl mx-auto">
                <h2 id="post-title" class="text-3xl font-bold mb-4 font-serif text-white">{post.title}</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    {#each post.category as category}
                        <span class="badge">{category}</span>
                    {/each}
                </div>
                <p class="text-gray-200 whitespace-pre-line">{post.description}</p>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .badge {
        @apply bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm;
    }

    .image-container :global(img) {
        @apply w-full h-full object-contain select-none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
</style> 