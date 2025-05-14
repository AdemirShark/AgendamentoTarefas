import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // ajuste para seu backend
})

export default {
    getTarefas() {
        return api.get('/tarefas')
    },
    criarTarefa(tarefa) {
        return api.post('/tarefas', tarefa)
    },
    editarTarefa(id, tarefa) {
        return api.put(`/tarefas/${id}`, tarefa)
    },
    deletarTarefa(id) {
        return api.delete(`/tarefas/${id}`)
    }
}
