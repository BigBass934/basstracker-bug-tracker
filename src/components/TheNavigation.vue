<template>
<div>
<div>
  <b-navbar id="nav" toggleable="lg" type="dark" variant="info">
    <img :src="bassimg.img" :alt="bassimg.desc" />
    <b-navbar-brand href="#">BassTracker</b-navbar-brand>

      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
        <ul class="nav-links">
            <li class="links">
                <b-nav-item to="/user">User-Dashboard</b-nav-item>
            </li>
            <li
                v-for="destination in destinations"
                :key="destination.name"
                class="links"
            >
                <b-nav-item
                    :to="{
                        name: 'DestinationDetails',
                        params: {slug:destination.slug}
                    }"
                >
                    {{destination.name}}
                </b-nav-item>
            </li>
        </ul>
      </b-navbar-nav>
  </b-navbar>
</div>
    
</div>
</template>

<script>
import store from "@/store.js";
export default {
    data(){
        return{
            // destinationId: this.$route.params.id,
            bassimg: {
                img: require(`@/assets/bass.jpg`),
                desc: "bass img here"
            },
            destinations:store.destinations
        };
    }
};
</script>
<style scoped>
img {
    max-width: 60px;
    padding: 0 10px;
}
#nav {
    display: flex;
    align-items: center;
    position:sticky;
    top:0;
    background-color:white;
    border-bottom:1px solid grey;
    z-index: 1;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 0 10px;
  text-decoration:none;
}

#nav a.vue-school-active-class {
  color: #a50000;
}
.nav-links{
    display: flex;
}
.links{
    padding-right: 20px;
    list-style: none;
}
.links:hover{
    text-decoration:underline;
}
.logo{
    font-size: 20px;
    color: purple;
    font-weight: bold;
}
</style>