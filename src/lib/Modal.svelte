<script lang="ts">
    export let showModal: boolean;
    export let onClose: () => void;

    const closeModal = () => {
        onClose();
    };
</script>

<div class="modal-backdrop" on:click={closeModal} style:display={showModal ? 'block' : 'none'}>
    <div class="modal-content" on:click|stopPropagation>
        <slot></slot>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 10;
    }

    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 400px;
        width: 80%;
        height: auto;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    button {
        margin-top: 1rem;
    }
</style>