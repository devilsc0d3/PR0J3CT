<script lang="ts">
    let isDown: boolean = false;
    let startX: number;
    let scrollLeft: number;
    let container: HTMLDivElement;

    function handleMouseDown(e: MouseEvent | Touch): void {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }

    function handleMouseLeave(): void {
        isDown = false;
        container.classList.remove('active');
    }

    function handleMouseUp(): void {
        isDown = false;
        container.classList.remove('active');
    }

    function handleMouseMove(e: MouseEvent | Touch): void {
        if (!isDown) return;
        if ("preventDefault" in e) {
            e.preventDefault?.();
        }
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1; // multiplier = vitesse de scroll
        container.scrollLeft = scrollLeft - walk;
    }
</script>

<style>
    .scroll-container {
        overflow: hidden;
        white-space: nowrap;
        cursor: grab;
    }

    .scroll-container.active {
        cursor: grabbing;
    }

    .scroll-item {
        display: inline-block;
        width: 200px;
        height: 100px;
        margin: 5px;
        background-color: #9a0dc1;
        color: white;
        line-height: 100px;
        text-align: center;
        border-radius: 4px;
        user-select: none;
    }
</style>

<div
        bind:this={container}
        class="scroll-container"
        on:mousedown={(e) => handleMouseDown(e)}
        on:mouseup={handleMouseUp}
        on:mousemove={(e) => handleMouseMove(e)}
        on:touchstart={(e) => handleMouseDown(e.touches[0])}
        on:touchmove={(e) => handleMouseMove(e.touches[0])}
        on:touchend={handleMouseUp}
>
    {#each Array(10) as _, i}
        <div class="scroll-item">Item {i + 1}</div>
    {/each}
</div>
