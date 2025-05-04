<script lang="ts">
    import { page } from '$app/state';
</script>

<link rel="stylesheet" href="/src/lib/styles/error/errorPage.css">

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
