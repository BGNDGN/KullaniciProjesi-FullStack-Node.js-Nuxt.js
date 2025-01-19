<template>
  <div id="mainPage">
    <h1>Kullanıcı Bilgileri</h1>
    <hr> 

    <!-- Kullanıcılar Listesi -->
    <div id="userMain">
      <h2>Kullanıcılar</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
          <button class="delete" @click="deleteUser(user.id)">Sil</button>
          <button class="edit" @click="editUser(user)">Düzenle</button>
        </li>
      </ul>
    </div>

    <!-- Kullanıcı Ekleme -->
    <div id="addUserMain">
      <h2>Yeni Kullanıcı Ekle</h2>
      <form @submit.prevent="addUser">
        <div>
          <label class="name" for="name">Ad:</label>
          <input
            class="ad"
            type="text"
            id="name"
            v-model="newUser.name"
            :disabled="loading"
          />
        </div>
        <div>
          <label for="email">Email:</label>
          <input
            class="email"
            type="email"
            id="email"
            v-model="newUser.email"
            :disabled="loading"
          />
        </div>
        <div>
          <button type="submit" :disabled="loading">Ekle</button>
        </div>
      </form>
    </div>

    <!-- Kullanıcı Güncelleme -->
    <div id="mainUpdateUser" v-if="updatedUser.id">
      <h2>Mevcut Kullanıcıyı Güncelle</h2>
      <form @submit.prevent="updateUser">
        <div>
          <label class="name" for="name">Ad:</label>
          <input
            type="text"
            id="name"
            v-model="updatedUser.name"
            :disabled="loading"
          />
        </div>
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="updatedUser.email"
            :disabled="loading"
          />
        </div>
        <div>
          <button type="submit" :disabled="loading">Güncelle</button>
        </div>
      </form>
    </div>
    <div id="velseUpdateUser" v-else>
      <p>Düzenleyeceğiniz Kullanıcıyı <strong>"Kullanıcılar"</strong> Bölümünden Seçip <strong>"Düzenle"</strong> Butonuna Basın".</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; 

import "@/styles/vue.css"

export default {
  data() {
    return {
      users: [], 
      user: null, 
      newUser: { name: '', email: '' },
      updatedUser: { id: '', name: '', email: '' }, 
      loading: false,
      error: null,
    };
  },
  async created() {
    await this.fetchUsers(); 
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        this.users = response.data;
      } catch (err) {
        console.error(err);
        this.error = 'Kullanıcılar alınırken hata oluştu';
      }
    },

    editUser(user) {
      this.updatedUser = { ...user }; 
    },

    async updateUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`http://localhost:3001/api/users/${this.updatedUser.id}`, this.updatedUser);
        alert('Kullanıcı bilgileri başarıyla güncellendi!');

        await this.fetchUsers(); 

        this.updatedUser = { id: '', name: '', email: '' }; 
      } catch (err) {
        this.error = 'Kullanıcı bilgileri güncellenirken hata oluştu';
      } finally {
        this.loading = false;
      }
    },

    async addUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3001/api/users',this.newUser);
        await this.fetchUsers(); 
        this.newUser = { name: '', email: '' }; 
        alert('Yeni kullanıcı başarıyla eklendi!');

      } catch (err) {
        if (err.response && err.response.data) {
          alert(`${err.response.data.message}`);   
          this.error = err.response.data.message
        }  

        else {
          this.error = 'Kullanıcı eklenirken bir hata oluştu.';  
        }

      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.delete(`http://localhost:3001/api/users/${id}`);
        await this.fetchUsers(); 
        alert('Kullanıcı başarıyla silindi!');
      } catch (err) {
        this.error = 'Kullanıcı silinirken hata oluştu';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
