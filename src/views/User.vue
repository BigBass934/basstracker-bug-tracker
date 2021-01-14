<template>
    <div>
        <h1>Welcome {{user}}</h1>
        <router-link :to="{
            name: 'invoices'
        }">Invoices</router-link>
        <button @click="logOut" class="btn">Log Out</button>
    </div>
</template>
<script>
import store from '@/store'
export default {
    data(){
        return{
            user: store.user
        };
    },
    methods: {
        logOut() {
            // Authenticate against the API
            store.user = null;
            const redirectPath = this.$route.query.redirect || "/";
            this.$router.push(redirectPath)
        }
    }
};
</script>