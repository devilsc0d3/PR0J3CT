<script lang="ts">
    import {goto} from '$app/navigation'; // Importer goto depuis SvelteKit
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import Modal from "$lib/Modal.svelte";
    import ModalDescription from "$lib/ModalDesciption.svelte";


    interface Column {
        id: string;
        name: string;
        projectId: string;
    }

    interface Task {
        id: string;
        title: string;
        content: string;
        columnId: string;
    }

    interface Project {
        id: string;
        title: string;
        description: string;
        background: string;
        createdAt: string;
        updatedAt: string;
    }

    let project: Project = $state({
        id: '',
        title: '',
        description: '',
        background: '',
        createdAt: '',
        updatedAt: ''
    });
    let columns: Column[] = $state([]);
    let tasks: Task[] = $state([]);
    const projectId = $page.params.cuid;

    const getProjectId = async () => {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erreur lors de la récupération du projet");
        }
    };

    // Fonction pour récupérer les colonnes depuis l'API
    const getColumns = async () => {
        const response = await fetch("/api/column/" + projectId);
        if (response.ok) {
            columns = (await response.json()) || [];
            return columns;
        } else {
            console.error("Erreur lors de la récupération des colonnes");
            return [];
        }
    };


    // Fonction pour récupérer les tâches depuis l'API
    const getTasks = async () => {
        const response = await fetch("/api/tasks");
        if (response.ok) {
            tasks = (await response.json()) || [];
            return tasks;
        } else {
            console.error("Erreur lors de la récupération des tâches");
            return [];
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
            // Réajuster l'état local avec la nouvelle tâche mise à jour
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );

            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    let name: string = $state('');
    const createColumn = async () => {
        if (!name) {
            console.error("Le nom de la colonne ne peut pas être vide");
            return;
        }
        const response = await fetch("/api/column", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                projectId,
            }),
        });

        if (response.ok) {
            name = '';
            columns = await getColumns();
        } else {
            console.error("Erreur lors de la création de la colonne");
        }
    };

    let taskTitle: string = $state('');

    const createTask = async (event: Event, idColumn: string) => {
        event.preventDefault();
        if (!taskTitle) {
            console.error("Le titre de la tâche ne peut pas être vide");
            return;
        }
        const response = await fetch("/api/tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle,
                content: '',
                columnId: idColumn, // Assigner à la première colonne par défaut
            }),
        });

        if (response.ok) {
            taskTitle = '';
            tasks = await getTasks();
        } else {
            console.error("Erreur lors de la création de la tâche");
        }
    };
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


    onMount(async () => {
        document.body.style.overflowY = 'hidden';
        project = await getProjectId();
        columns = await getColumns();
        tasks = await getTasks();
    });

    const deleteColumn = async (columnId: string) => {
        const response = await fetch(`/api/column/${columnId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            columns = columns.filter(column => column.id !== columnId);
            tasks = tasks.filter(task => task.columnId !== columnId);
        } else {
            console.error("Erreur lors de la suppression de la colonne");
        }
    };

    const deleteTask = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== taskId);
            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la suppression de la tâche");
        }
    };

    const updateColumnName = async (columnId: string, newName: string) => {
        const response = await fetch(`/api/column/${columnId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName,
            }),
        });

        if (response.ok) {
            const updatedColumn = await response.json();
            columns = columns.map(column =>
                column.id === columnId ? { ...column, name: updatedColumn.name } : column
            );
            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la mise à jour du nom de la colonne");
        }
    };

    // modal
    let showModal = false;
    const openModal = () => {
        showModal = true;
    };
    const closeModal = () => {
        showModal = false;
    };

    // modal description
    let showModalDescription = $state(false);
    const openModalDescription = () => {
        showModalDescription = true;
    };
    const closeModalDescription = () => {
        showModalDescription = false;
    };
</script>

<style>
    .header {
        color : #ffffff;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        width: clamp(300px, 50vw, 400px);
        background-color: rgba(0,0,0,0.5);
        backdrop-filter: blur(8px);

        padding: 10px;
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
        width: 200px;
        max-height: 70vh;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(8px);
        background: rgba(0,0,0,0.5);
        transition: background-color 0.3s;
    }

    .task {
        width: 150px;
        height: auto;
        background-color: #ffffff;
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
        width: 100px;
    }

    .body {

        background-size: cover;
        min-height: 100vh;
        /*width: clamp(100%, 100rem, 100rem);*/
        margin: 0;
    }

    .icon {
        width: 35px;
        height: 35px;
        margin: 0;
        filter: invert(1) sepia(1) saturate(5) hue-rotate(200deg);
    }

    .icon-black {
        width: 35px;
        height: 35px;
        margin: 0;
    }

    .icon:active {
        transform: scale(0.9);
        transition: transform 0.2s;
    }

    .icon:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }

    .icon:hover {
        transform: scale(1.3);
        transition: transform 0.2s;
    }

    .space-between {
        padding: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 20px;
    }

    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .center-block {
        text-align: center;
        display: block;
    }


</style>
<div class="body" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background-color: ${project.background}`}>

    <header class="header">
        <div class="space-between">
            <a href="/profile"><img class="icon" src="/images/icon/workspace.svg" alt="Workspace" /></a>
            <button on:click={openModalDescription} class="new"><img class="icon" src="/images/icon/description.svg" alt="description" /></button>
            <img class="icon" src="/images/icon/share.svg" alt="share" />
            <img class="icon" src="/images/icon/filter.svg" alt="filter" />
        </div>
    </header>
        <div class="board">
            {#each columns as column (column.id)}
                <section class="column" on:dragover={onDragOver} on:drop={(event) => onDrop(event, column.id)}>
                    <div class="space-between">
                        <input type="text" bind:value={column.name} on:blur={() => updateColumnName(column.id, column.name)} on:keydown={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name)}/>
                        <img src="/images/icon/delete.svg" alt="Supprimer" class="icon" on:click={() => deleteColumn(column.id)} />
                    </div>

                    <div class="tasks">
                        {#each getTasksForColumn(column.id) as task (task.id)}
                            <button on:click={openModal}>
                            <div class="task" role="button" draggable="true" on:dragstart={(event) => onDragStart(event, task.id, task.columnId)} on:dragend={onDragEnd}>
                                <div class="space-between">
                                    <h3>{task.title}</h3>
                                    <img src="/images/icon/delete.svg" alt="Supprimer" class="icon-black" on:click={() => deleteTask(task.id)} />
                                </div>
                            </div>
                            </button>
                        {/each}
                    </div>
                    <form on:submit|preventDefault={(event) => createTask(event, column.id)}>
                        <input type="hidden" name="columnId" value={column.id} />
                        <input type="text" placeholder="Nouvelle tâche" name="title" bind:value={taskTitle} />
                        <button type="submit">Ajouter</button>
                    </form>
                </section>
            {/each}
            <section class="column">
                <form on:submit|preventDefault={createColumn}>
                    <input type="text" placeholder="Nom de la colonne" name="name" bind:value={name} />
                    <button type="submit">Ajouter</button>
                </form>
            </section>
        </div>
</div>

<Modal bind:showModal onClose={closeModal}>
    <div class="center">
        <h1>azerty</h1>
        <textarea></textarea>
    </div>
</Modal>
<ModalDescription bind:showModalDescription onClose={closeModalDescription}>
    <div class="center-block br-50px blue">
        <h1>{project.title}</h1><br>
        <p>{project.description}</p>
    </div>
</ModalDescription>