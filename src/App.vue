<template>
    <div class="app">
        <nav class="navbar">
            <router-link class="nav-link" to="/">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </router-link>
            <router-link class="nav-link" to="/lista">
                <i class="fas fa-users"></i>
                <span>Usuários</span>
            </router-link>
        </nav>
        <router-view />
    </div>
</template>

<style scoped>
    .app {
        font-family: 'Arial', sans-serif;
        padding: 20px;
        background-color: #f4f7f6;
        min-height: 100vh;
    }

    .navbar {
        display: flex;
        justify-content: flex-start;
        gap: 20px;
        margin-bottom: 1rem;
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        padding: 10px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.1rem;
        padding: 8px 12px;
        border-radius: 8px;
        transition: background 0.3s, transform 0.2s;
    }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .nav-link i {
            font-size: 1.2rem;
        }
</style>
