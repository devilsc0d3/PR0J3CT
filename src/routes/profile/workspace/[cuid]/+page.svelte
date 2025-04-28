<script lang="ts">
    import { goto } from '$app/navigation';  // Importer goto depuis SvelteKit
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import Modal from "$lib/Modal.svelte";
    import ModalDesciption from "$lib/ModalDesciption.svelte";

    onMount(() => {
        document.body.style.overflowY = 'hidden';
    });

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

    let project: Project = {
        id: '',
        title: '',
        description: '',
        background: '',
        createdAt: '',
        updatedAt: ''
    };
    let columns: Column[] = [];
    let tasks: Task[] = [];


    const projectId = $page.params.cuid;
    const getProjectId = async () => {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
            const project = await response.json();
            return project;
        } else {
            console.error("Erreur lors de la récupération du projet");
        }
    };


    onMount(async () => {
        project = await getProjectId();
    });


    // Fonction pour récupérer les colonnes depuis l'API
    const getColumns = async () => {
        const response = await fetch("/api/column/" + projectId);
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
            // Réajuster l'état local avec la nouvelle tâche mise à jour
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );

            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    let name: string = '';
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
            const newColumn = await response.json();
            columns.push(newColumn);

            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
        } else {
            console.error("Erreur lors de la création de la colonne");
        }
    };

    let taskTitle: string = '';

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
            const newTask = await response.json();
            tasks.push(newTask);
            taskTitle = ''; // Réinitialiser le champ de saisie

            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
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

    let loading = true;

    onMount(async () => {
        await getColumns();
        await getTasks();
        loading = false;
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
            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
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
            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
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
    let showModalDescription = false;
    const openModalDescription = () => {
        showModalDescription = true;
    };
    const closeModalDescription = () => {
        showModalDescription = false;
    };
</script>

<style>

    .h3 {
        color: #ffffff;
        font-size: 2em;
        text-align: center;
        margin: 0;
        padding: 20px;
    }
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

    .header h1 {
        font-size: 1.5em;
        text-align: center;
        margin: 0;
        padding: 20px;
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
        backdrop-filter: blur(8px);
        background: rgba(0,0,0,0.5);
        transition: background-color 0.3s;
    }

    .column h2 {
        text-align: center;
        font-size: 1.5em;
        margin: 20px;
        color: #ffffff;
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


    .body {

        background-size: cover;
        min-height: 100vh;
        width: clamp(100%, 100rem, 100rem);
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

    .space-beetween {
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

    /*.margin-50px {*/
    /*    margin: 50px;*/
    /*}*/

    .center-block {
        text-align: center;
        display: block;
    }
</style>

<!--<ModalDesciption bind:showModalDescription onClose={closeModalDescription}/>-->
<ModalDesciption bind:showModalDescription onClose={closeModalDescription}>
    <div class="center-block br-50px blue">
        <h1>{project.title}</h1><br>
        <p>{project.description}</p>
    </div>
</ModalDesciption>
<div class="body" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background-color: ${project.background}`}>

    <header class="header">
        <div class="space-beetween">
            <a href="/profile"><img class="icon" src="http://localhost:5173/workspace.svg" alt="Workspace" /></a>
            <button on:click={openModalDescription} class="new"><img class="icon" src="http://localhost:5173/description.svg" alt="Workspace" /></button>
            <img class="icon" src="http://localhost:5173/share.svg" alt="Workspace" />
            <img class="icon" src="http://localhost:5173/filter.svg" alt="Workspace" />
        </div>
    </header>
    {#if loading}
        <div class="center-block">
            <p>Chargement...</p>
        </div>
    {:else}
        <div class="board">
            {#each columns as column (column.id)}
                <section
                        class="column"
                        role="region"
                        on:dragover={onDragOver}
                        on:drop={(event) => onDrop(event, column.id)}
                >
                    <div class="space-beetween">
                        <input type="text" bind:value={column.name} on:blur={() => updateColumnName(column.id, column.name)} on:keydown={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name)}/>
                        <img src="/delete.svg" alt="Supprimer" class="icon" on:click={() => deleteColumn(column.id)} />
                    </div>

                    <div class="tasks">
                        {#each getTasksForColumn(column.id) as task (task.id)}
                            <button on:click={openModal}>
                            <div
                                    class="task"
                                    role="button"
                                    draggable="true"
                                    on:dragstart={(event) => onDragStart(event, task.id, task.columnId)}
                                    on:dragend={onDragEnd}
                            >
                                <div class="space-beetween">
                                    <h3>{task.title}</h3>
                                    <img src="/delete.svg" alt="Supprimer" class="icon-black" on:click={() => deleteTask(task.id)} />
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
    {/if}
</div>
<Modal bind:showModal onClose={closeModal}>
    <div class="center">
        <h1>aazerty</h1>
        <textarea></textarea>
    </div>
</Modal>