<script lang="ts">
    import { goto } from '$app/navigation';  // Importer goto depuis SvelteKit

    import { onMount } from 'svelte';
    interface Column {
        id: string;
        title: string;
        projectId: string;
    }

    interface Task {
        id: string;
        title: string;
        content: string;
        columnId: string;
    }

    let columns: Column[] = [];
    let tasks: Task[] = [];

    const projectId = "cm93ahqor0003mdn8mcjwkfc6";  // L'ID du projet

    // Fonction pour récupérer les colonnes depuis l'API
    const getColumns = async () => {
        const response = await fetch("/api/column");
        if (response.ok) {
            columns = await response.json();
        } else {
            console.error("Erreur lors de la récupération des colonnes");
        }
    };

    // Fonction pour récupérer les tâches depuis l'API
    const getTasks = async () => {
        const response = await fetch("/api/tasks");
        if (response.ok) {
            tasks = await response.json();
        } else {
            console.error("Erreur lors de la récupération des tâches");
        }
    };

    // Fonction pour mettre à jour une tâche via l'API
    const updateTask = async (taskId: string, newColumnId: string) => {
        const response = await fetch("/api/tasks", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId,
                columnId: newColumnId,
            }),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            console.log('Tâche mise à jour:', updatedTask);
            // Réajuster l'état local avec la nouvelle tâche mise à jour
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );

            goto('/profile/workspace').then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    // Appeler les API au chargement du composant
    // onMount(async () => {
    //     await getColumns();
    //     await getTasks();
    // });

    let draggedTaskId: string | null = null;
    let draggedColumnId: string | null = null;

    const getTasksForColumn = (columnId: string) => {
        return tasks.filter(task => task.columnId === columnId);
    };

    const onDragStart = (event: DragEvent, taskId: string, columnId: string) => {
        draggedTaskId = taskId;
        draggedColumnId = columnId;
        event.dataTransfer?.setData('text/plain', "${taskId}");
    };

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const onDrop = async (event: DragEvent, columnId: string) => {
        event.preventDefault();

        if (draggedTaskId !== null && draggedColumnId !== null && draggedColumnId !== columnId) {
            // Mettre à jour la tâche via l'API
            await updateTask(draggedTaskId, columnId);
        }

        draggedTaskId = null;
        draggedColumnId = null;
    };

    const onDragEnd = (event: DragEvent) => {
        const target = event.target as HTMLElement;
        target.classList.remove('dragging');
    };

    let loading = true;

    onMount(async () => {
        await getColumns();
        await getTasks();
        loading = false;
    });

</script>

<style>

    .header {
        position: absolute;
        bottom: 0;
        border-radius: 20px;
        width: 80%;
    }
    .board {
        display: flex;
        justify-content: start;
    }

    .column {
        flex: 1;
        border-radius: 8px;
        padding: 16px;
        margin: 10px;
        width: 100px;
        height: 90%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: rgba(0,0,0,0.5);
        transition: background-color 0.3s;
    }

    .column h2 {
        text-align: center;
        font-size: 1.5em;
        margin: 20px
    }

    .task {
        background-color: #fff;
        border-radius: 4px;
        padding: 12px;
        margin: 8px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: grab;
        transition: transform 0.1s ease-in-out;
    }

    .task h3 {
        font-size: 1.2em;
        margin: 0;
    }

    .task p {
        font-size: 0.9em;
        margin-top: 8px;
    }

    .column.dragover {
        background-color: #e7f7ff;
    }

    .task.dragging {
        opacity: 0.5;
    }

    .blue {
        background-color: #fdbd2d;
        color: #ffffff;
        padding: 20px;
        border-radius: 8px;
    }

    .body {
        background: url('../wallpaper4.jpg') no-repeat center center fixed;
        background-size: cover;
        min-height: 100vh; /* Ensures the background covers the viewport initially */
        width: 100%;
        margin: 0;
    }
</style>

<div class="body">
    <header class="header blue">
        <h1 class="text-3xl mb-8">Mon espace de travail</h1>
    </header>
    {#if loading}
        <p>Chargement...</p>
    {:else}
        <div class="board">
            {#each columns as column (column.id)}
                <section
                        class="column"
                        role="region"
                        on:dragover={onDragOver}
                        on:drop={(event) => onDrop(event, column.id)}
                >
                    <h2>{column.title}</h2>
                    <div class="tasks">
                        {#each getTasksForColumn(column.id) as task (task.id)}
                            <div
                                    class="task"
                                    role="button"
                                    draggable="true"
                                    on:dragstart={(event) => onDragStart(event, task.id, task.columnId)}
                                    on:dragend={onDragEnd}
                            >
                                <h3>{task.title}</h3>
                                <p>{task.content}</p>
                            </div>
                        {/each}
                    </div>
                </section>
            {/each}
        </div>
    {/if}
</div>