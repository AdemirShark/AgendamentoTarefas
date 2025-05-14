<template>
    <div>
        <BContainer class="bv-example-row">
            <BRow>
                <BCol>
                    <button @click="abrirModal" class="btn" style="padding:6px 8px">
                        Criar Tarefa
                    </button>
                </BCol>
            </BRow>
            <BRow>
                <BCol>
                    <label>Selcione o Usuario: &nbsp;</label>
                    <select v-model="usuarioSelecionado" @change="buscarTarefas" class="select-box">
                        <option value="">Selecione um usuário</option>
                        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                            {{ usuario.nome }}
                        </option>
                    </select>
                </BCol>

            </BRow>
            <div v-if="tarefas.length" class="kanban">
                <div v-for="tarefa in tarefas"
                     :key="tarefa.id"
                     :class="['card', tarefa.prioridade.toLowerCase()]">

                    <div class="card-header">
                        <h3>{{ tarefa.titulo }}</h3>
                        <div class="actions">
                            <button @click="editarTarefa(tarefa)" title="Editar" class="btn_icons">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button @click="deletarTarefa(tarefa.id)" title="Deletar" class="btn_icons">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <p>{{ tarefa.descricao }}</p>
                    <small>{{ formatarData(tarefa.dataHora) }}</small>
                    <span class="tag">{{ tarefa.prioridade }}</span>
                </div>
            </div>

            <!-- Modal de criação de tarefa -->
            <b-modal v-model="modalAberto"
                     :keyboard="false"
                     :backdrop="static"
                     no-close-on-backdrop
                     no-close-on-esc
                     no-footer
                     no-header
                     title="Tarefa">
                <div class="nova-tarefa">
                    <span style="font-size:20px; font-weight:bold">
                        {{ modo == 'criar' ? "Criar Nova Tarefa" : "Editar Tarefa" }}
                    </span>
                    <form @submit.prevent="salvarTarefa" class="task-form">
                        <div class="form-group">
                            <label for="titulo">Título:</label>
                            <input v-model="novaTarefa.titulo" id="titulo" placeholder="Título da tarefa" required />
                        </div>

                        <div class="form-group">
                            <label for="descricao">Descrição:</label>
                            <textarea v-model="novaTarefa.descricao" id="descricao" placeholder="Descrição da tarefa"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="dataConclusao">Data de Conclusão:</label>
                            <input type="date" v-model="novaTarefa.dataHora" id="dataConclusao" required />
                        </div>

                        <div class="form-group">
                            <label for="prioridade">Prioridade:</label>
                            <select v-model="novaTarefa.prioridade" id="prioridade">
                                <option>BAIXA</option>
                                <option>MEDIA</option>
                                <option>ALTA</option>
                            </select>
                        </div>

                        <div class="form-group" v-if="modo === 'criar'">
                            <label for="usuario">Para o Usuário:</label>
                            <select v-model="novaTarefa.usuarioId" id="usuario">
                                <option value="">Selecione um usuário</option>
                                <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                                    {{ usuario.nome }}
                                </option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn_salvar">Salvar</button>
                        <button type="button" @click="fecharModal" class="btn btn_cancel">Cancelar</button>
                    </form>
                </div>
            </b-modal>


        </BContainer>
    </div>
</template>

<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';
    export default {
        data() {
            return {
                usuarios: [],
                usuarioSelecionado: null,
                tarefas: [],
                novaTarefa: {
                    titulo: '',
                    descricao: '',
                    dataHora: '',
                    prioridade: 'Média',
                    usuarioId: ''
                },

                modalAberto: false,
                modalAbertoUsuario: false,
                modo: 'criar', // ou 'editar'
            };
        },
        mounted() {
            this.getUsers();
        },
        methods: {

            abrirModal() {
                this.modalAberto = true;
            },

            editarTarefa(tarefa) {

                this.modo = 'editar';

                this.novaTarefa = tarefa;
                this.novaTarefa.dataHora = tarefa.dataHora.split('T')[0];
                this.modalAberto = true;
                // Aqui você pode abrir um modal de edição ou navegar para a tela de edição
            },
            deletarTarefa(tarefaId) {
                Swal.fire({
                    title: 'Tem certeza?',
                    text: "Você não poderá reverter isso!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const options = {
                            method: 'DELETE',
                            url: 'http://localhost:8080/tarefas/' + tarefaId,
                            headers: { 'Content-Type': 'application/json' },
                        };

                        axios.request(options).then(response => {
                            Swal.fire({
                                title: 'Sucesso!',
                                text: 'Usuário Excluido com sucesso.',
                                icon: 'warning',
                                confirmButtonText: 'Fechar'
                            });
                            this.buscarTarefas();
                        })
                            .catch(function (error) {
                                console.error(error);

                            });

                    }
                });

            },
            fecharModal() {
                this.modalAberto = false;
                this.limparModal();

            },
            limparModal() {
                this.modo = 'criar';
                this.novaTarefa = {
                    titulo: '',
                    descricao: '',
                    dataHora: '',
                    prioridade: 'Média',
                    usuarioId: ''
                };
            },

            async salvarTarefa() {
                let options = {
                    method: 'POST',
                    url: 'http://localhost:8080/tarefas',
                    headers: { 'Content-Type': 'application/json' },
                    data: this.novaTarefa
                };
                if (this.modo == 'editar') {
                    options.method = 'PUT';
                    options.url = `http://localhost:8080/tarefas/${this.novaTarefa.id}`;

                }


                axios.request(options).then(response => {
                    console.log("cliente ", response)
                    let text = this.modo == 'criar' ? 'Criada' : 'Editada';
                    this.limparModal();
                    this.modalAberto = false;
                    this.usuarioSelecionado = response.data.usuarioId;
                    this.buscarTarefas();
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Tarefa ' + text + ' com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'Fechar'
                    });

                })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Não foi possível salvar os dados.',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 4000,
                            timerProgressBar: true,
                        });
                    });

            },
            async buscarTarefas() {
                if (this.usuarioSelecionado) {

                    const response = await axios.get(`http://localhost:8080/usuarios/${this.usuarioSelecionado}/tarefas`);
                    this.tarefas = response.data;

                } else {
                    this.tarefas = [];
                }
            },
            async getUsers() {
                const response = await axios.get('http://localhost:8080/usuarios');
                this.usuarios = response.data;
            },
            formatarData(dataHora) {
                console.log(dataHora)
                const data = new Date(dataHora);
                return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            },

        }
    }




</script>

<style scoped>
    .select-box {
        margin: 1rem 0;
        padding: 0.5rem;
        font-size: 1rem;
    }

    .kanban {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    .card {
        border-radius: 10px;
        padding: 1rem;
        color: #fff;
        position: relative;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }

        .card:hover {
            transform: translateY(-5px);
        }





    /* Prioridades coloridas */
    .alta {
        background: linear-gradient(135deg, #ff4e50, #f9d423);
    }

    .media {
        background: linear-gradient(135deg, #f7971e, #ffd200);
    }

    .baixa {
        background: linear-gradient(135deg, #43cea2, #185a9d);
    }

    .tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.2);
        padding: 0.2rem 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: bold;
    }

    .nova-tarefa {
        padding: 20px;
        background-color: #f4f7f6;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h1 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }

    .task-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    input,
    textarea,
    select {
        padding: 10px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid #ddd;
        background-color: #fff;
    }

    textarea {
        resize: vertical;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

        button:hover {
            background-color: #0056b3;
        }

    .cancel-btn {
        background-color: #d9534f;
    }

        .cancel-btn:hover {
            background-color: #c9302c;
        }

    /* Estilos do Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
    }

    .btn_icons {
        background: none;
        border: none;
        color: #333;
        cursor: pointer;
        font-size: 15px;
        margin-right: 10px;
        color: #fff;
    }

        .btn_icons:hover {
            opacity: 0.8;
            background: none;
        }

    .btn_cancel {
        background-color: #e03c3c;
        color: white;
        padding: 8px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

        .btn_cancel:hover {
            background-color: #e03c3c;
            opacity: 0.8;
            color: #FFF;
        }

    .btn_salvar {
        background-color: #28a745;
        color: white;
        padding: 8px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

        .btn_salvar:hover {
            background-color: #28a745;
            opacity: 0.8;
            color: #FFF;
        }
</style>
