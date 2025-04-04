<script lang="ts">
    import { page } from '$app/state';
</script>

<style>
    .m-0 {
        margin: 0;
    }

    .m-5 {
        margin: 50%;
    }

    h1 {
        font-size: 3rem;
        color: #333;
        width: 240px;
    }
</style>
<h1 class="center m-5">error : {page.status}</h1>
