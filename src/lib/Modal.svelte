<script lang="ts">
    export let showModal: boolean;
    export let onClose: () => void;

    const closeModal = () => {
        onClose();
    };
</script>

<div class="modal-backdrop" on:click={closeModal} style:display={showModal ? 'block' : 'none'}>
    <div class="center modal" on:click|stopPropagation>
        <slot></slot>
    </div>
</div>

<style>
    .modal-backdrop {
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
        /*min-height: 400px;*/
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