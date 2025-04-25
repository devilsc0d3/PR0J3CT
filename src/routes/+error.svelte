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
        <p class=""> {page.error.message}</p>
        <img src="http://localhost:5173/desesperate.jpg" alt="Error Image" class="error-image">
    </div>
</section>
