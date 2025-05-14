<template>
    <BContainer class="bv-example-row">
        <BRow>
            <BCol><button @click="abrirModalUser" class="btn_criarUser">Criar Usuario</button> </BCol>
        </BRow>
        <b-table :items="usuarios" :fields="fields" striped hover>
            <!-- Coluna personalizada: Quantidade de Tarefas -->
            <template #cell(qtdTarefas)="data">
                {{ data.item.tarefas.length }}
            </template>

            <!-- Coluna personalizada: Ações (Editar | Excluir) -->
            <template #cell(acoes)="data">
                <b-button size="sm" variant="primary" @click="editarUsuario(data.item)">Editar</b-button>
                <b-button size="sm" variant="danger" class="ms-2" @click="excluirUsuario(data.item.id)">Excluir</b-button>
            </template>
        </b-table>
        <!-- Modal de Edicao de USUARIO -->
        <div v-if="modalAbertoEditarUsuario" class="modal-overlay" @click="fecharModalUsuario">
            <div class="modal-content" @click.stop>
                <div class="nova-tarefa">
                    <span style="font-size:20px; font-weight:bold">Criar Novo Usuário</span>
                    <form @submit.prevent="editUser" class="task-form">
                        <div class="form-group">
                            <label for="nome">Nome:</label>
                            <input v-model="user.nome" id="nome" placeholder="Nome" required />
                        </div>
                        <div class="form-group">
                            <label for="nome">Email:</label>
                            <input v-model="user.email" id="email" placeholder="Email" required />
                        </div>
                        <button type="submit" class="btn btn_salvar">Salvar</button>
                        <button type="button" @click="fecharModalUsuario" class="btn btn_cancel">Cancelar</button>
                    </form>
                </div>
            </div>
        </div>
        <!-- Modal de criação de USUARIO -->
        <div v-if="modalAbertoUsuario" class="modal-overlay" @click="fecharModalUsuario">
            <div class="modal-content" @click.stop>
                <div class="nova-tarefa">
                    <span style="font-size:20px; font-weight:bold">Criar Novo Usuário</span>
                    <form @submit.prevent="salvarUsuario" class="task-form">
                        <div class="form-group">
                            <label for="nome">Nome:</label>
                            <input v-model="novoUser.nome" id="nome" placeholder="Nome" required />
                        </div>
                        <div class="form-group">
                            <label for="nome">Email:</label>
                            <input v-model="novoUser.email" id="email" placeholder="Email" required />
                        </div>
                        <button type="submit" class="btn btn_salvar">Salvar</button>
                        <button type="button" @click="fecharModalUser" class="btn btn_cancel">Cancelar</button>
                    </form>
                </div>
            </div>
        </div>
    </BContainer>
</template>

<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';
    export default {
        data() {
            return {
                usuarios: [],
                fields: [
                    { key: 'nome', label: 'Nome' },
                    { key: 'email', label: 'Email' },
                    { key: 'qtdTarefas', label: 'Qtd. Tarefas' },
                    { key: 'acoes', label: 'Ações' }
                ],
                novoUser: {
                    nome: '',
                    email: '',
                },
                user: {
                    id: '',
                    nome: '',
                    email: '',
                },
                modalAbertoEditarUsuario: false,
                modalAbertoUsuario: false
            };
        },
        mounted() {
            this.getUsers();
        },
        methods: {
            abrirModalUser() {
                this.modalAbertoUsuario = true;
            },
            fecharModalUser() {
                this.modalAbertoUsuario = false;
            },
            fecharModalUsuario() {
                this.modalAbertoEditarUsuario = false;
            },
            async getUsers() {
                const response = await axios.get('http://localhost:8080/usuarios');
                this.usuarios = response.data;
            },
            async salvarUsuario() {
                const options = {
                    method: 'POST',
                    url: 'http://localhost:8080/usuarios',
                    headers: { 'Content-Type': 'application/json' },
                    data: this.novoUser
                };

                axios.request(options).then(response => {
                    console.log(response.data);
                    this.modalAbertoUsuario = false;
                    this.getUsers();
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Usuário criado com sucesso.',
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
            editarUsuario(usuario) {
                this.modalAbertoEditarUsuario = true;
                this.user.nome = usuario.nome;
                this.user.email = usuario.email;
                this.user.id = usuario.id;
            },
            async editUser() {
                const options = {
                    method: 'PUT',
                    url: 'http://localhost:8080/usuarios/' + this.user.id,
                    headers: { 'Content-Type': 'application/json' },
                    data: this.user
                };

                axios.request(options).then(response => {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Usuário editado com sucesso.',
                        icon: 'success',
                        confirmButtonText: 'Fechar'
                    });
                    this.getUsers()
                    this.fecharModalUsuario();
                });

            },
            excluirUsuario(id) {
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
                            url: 'http://localhost:8080/usuarios/' + id,
                            headers: { 'Content-Type': 'application/json' },
                        };

                        axios.request(options).then(response => {
                            Swal.fire({
                                title: 'Sucesso!',
                                text: 'Usuário Excluido com sucesso.',
                                icon: 'warning',
                                confirmButtonText: 'Fechar'
                            });
                            this.getUsers();
                        })
                            .catch(function (error) {
                                console.error(error);

                            });

                    }
                });



            },

        }
    };
</script>

<style scoped>
    .ms-2 {
        margin-left: 0.5rem;
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

    input {
        padding: 10px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid #ddd;
        background-color: #fff;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .btn_criarUser {
        background-color: #007bff;
        color: white;
        padding: 6px 8px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 10px;
    }

    .btn_cancel {
        background-color: #e03c3c;
        color: white;
        padding: 8px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 10px;
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

