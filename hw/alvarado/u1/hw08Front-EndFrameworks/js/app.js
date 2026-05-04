// JavaScript Document

const { createApp } = Vue;

createApp({
  data() {
    return {
      usuarios: [],
      mostrarFormulario: false,
      editando: false,
      form: {
        id: null,
        first_name: '',
        last_name: '',
        identification_number: '',
        email: '',
        birthdate: '',
        age: '',
        phone_number: ''
      }
    }
  },

  mounted() {
    this.cargarDatos();
  },

  methods: {

    cargarDatos() {
      fetch("api/getCustomers.php")
        .then(res => res.json())
        .then(data => this.usuarios = data);
    },

    guardar() {
      let url = this.editando
        ? "api/updateCustomer.php"
        : "api/insertCustomer.php";

      let data = { ...this.form };

      // 🔥 evitar enviar id cuando se crea
      if (!this.editando) {
        delete data.id;
      }

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(() => {
        this.cargarDatos();
        this.cancelar();
      });
    },

    editar(user) {
      this.form = { ...user };
      this.editando = true;
      this.mostrarFormulario = true;
    },

    eliminar(id) {
      fetch("api/deleteCustomer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      .then(() => this.cargarDatos());
    },

    cancelar() {
      this.form = {
        id: null,
        first_name: '',
        last_name: '',
        identification_number: '',
        email: '',
        birthdate: '',
        age: '',
        phone_number: ''
      };
      this.editando = false;
      this.mostrarFormulario = false;
    },
	  
	updateAge() {
	  if (!this.form.birthdate) return;

	  const today = new Date();
	  const birthDate = new Date(this.form.birthdate);

	  let age = today.getFullYear() - birthDate.getFullYear();
	  const monthDiff = today.getMonth() - birthDate.getMonth();

	  if (monthDiff < 0 || 
		 (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	  }

	  this.form.age = age >= 0 ? age : 0;
	}

  }

}).mount("#app");