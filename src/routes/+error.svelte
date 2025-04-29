<script lang="ts">
    import { page } from '$app/state';
</script>

<style>
    section {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #ffffff;
        height: 100vh;
        margin: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
    }

    h1 {
        font-size: clamp(80px, 50%, 200px);
        margin: 0;
    }

    img {
        width: clamp(10px, 30%, 500px);
    }
</style>
<section>
    <div class="container">
        <h1 class="">{page.status}</h1>
        {#if page.error}
            <p class="">{page.error.message}</p>
        {:else}
            <p class="">An unknown error occurred.</p>
        {/if}
        <img src="/images/background/desperate.jpg" alt="Desperate person" class="error-image">
    </div>
</section>
