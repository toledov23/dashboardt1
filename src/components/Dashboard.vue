<template>
  <div class="mt-6">
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-container class="pa-1">
    <div>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Selecciona fecha"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          :max="(new Date(Date.now() -
          (new Date()).getTimezoneOffset() *
          60000)).toISOString().substr(0, 10)"
          min="2021-01-01"
          locale="es"
          @change="getLogs"
        ></v-date-picker>
      </v-menu>
    </div>
    <v-data-table
      :headers="headers"
      :items="logs"
      item-key="name"
      class="elevation-1"
      :search="search"
      :items-per-page="5"
      :custom-filter="filterByEmail"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Buscar"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:item="row">
        <tr>
        <td>{{row.item.id}}</td>
        <td>{{row.item.user_email}}</td>
          <td><v-btn x-small color="primary" dark @click="onButtonClick(row.item.user)">
          Get User Info
          </v-btn></td>
          <td><v-btn x-small color="primary" dark @click="onButtonClick(row.item.extra_data)">
          Get Extra-data
          </v-btn></td>
          <td><v-btn x-small color="primary" dark @click="onButtonClick(row.item.response)">
          Get Response
          </v-btn></td>
          <td>{{row.item.url}}</td>
        </tr>
      </template>
    </v-data-table>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2 text-center">
            Información
          </v-card-title>

          <v-card-text>
            <v-list dense>
            <v-list-item v-for="(item, name) in infoDialog" :key="name">
              <v-list-item-content>
                {{ name }}:
              </v-list-item-content>
              <v-list-item-content
              class="align-end">
                {{ item }}
              </v-list-item-content>
            </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
/* const moment = require('moment'); */
import { format, parseISO } from 'date-fns';
import logsService from '../services/logs';

export default {
  data() {
    return {
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu: false,
      search: '',
      logs: [],
      overlay: false,
      dialog: false,
      infoDialog: {},
      categoriesLogs: [],
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Id', value: 'id' },
        {
          text: 'User Email',
          align: 'start',
          sortable: false,
          value: 'user_email',
        },
        { text: 'User', value: 'user' },
        { text: 'Extra-data', value: 'extra_data' },
        { text: 'Response', value: 'response' },
        { text: 'URL', value: 'url' },
      ];
    },
  },

  watch: {
  },

  mounted() {
    this.getLogs();
  },
  methods: {
    filterByEmail(value, search) {
      return value != null
          && search != null
          && typeof value === 'string'
          && value.toString().indexOf(search) !== -1;
    },

    async getLogs() {
      this.overlay = true;
      this.logs = await logsService.getLogs(this.date);
      this.overlay = false;
      console.log(this.logs);
      /* this.originalTest = JSON.parse(JSON.stringify(this.test)); */
    },

    getUserData() {
      this.logs.map((el) => el.user);
    },

    onButtonClick(item) {
      this.dialog = true;
      this.categoriesLogs = Object.keys(JSON.parse(item));
      console.log(this.categoriesLogs);
      this.infoDialog = JSON.parse(item);
      console.log(this.infoDialog);
    },
  },
};
</script>
