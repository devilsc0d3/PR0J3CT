<script lang="ts">
    export let showModalDescription: boolean;
    export let onClose: () => void;
    const closeModalDescription= () => {
        onClose();
    };
</script>

<style>
    #background {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    .modal {
        position: fixed;
        z-index: 2;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 300px;
        min-height: 400px;
        background: #1c1c1c;
        color: #ffffff;
        border-radius: 15px;
        filter: drop-shadow(0 0 20px #333);
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 10;
    }
</style>

<div id="background" class="overlay2 modal-backdrop" on:click={closeModalDescription} style:display={showModalDescription ? 'block' : 'none'}>
    <div class="center modal">
        <slot></slot>
    </div>
</div>
