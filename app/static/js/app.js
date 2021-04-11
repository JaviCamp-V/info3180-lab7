const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
           <router-link to="/upload" class="nav-link">Upload</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});


app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }   
};


const uploadForm ={
    name: 'upload-form',
    template: `
    <div class="form-container">
    <div class="alert alert-success " v-if="status === 'success'" >File Upload Successful</div>
    <div class="alert alert-danger"  v-if="status === 'danger'">
    <ul>
    <li v-for="error in erros" class=""> {{error}} </li>
    </ul>
    </div>
    </div>
        <form method="post" enctype="multipart/form-data" @submit.prevent="uploadPhoto" id="uploadForm">
            <div class="form-group">
                <label class="imgup" for="description">Desscription</label>
                <textarea  id="description" name="description" class="form-control"></textarea>
            </div>
            <div class="form-group">
                <label class="imgup" for="photo">Photo</label>
                <input type="file" class="form-control" id="photo" name="photo" >
            </div>
            <button  type="submit" name="submit" id="up" class="btn btn-primary">Submit</button>
        </form>
    </div>
    
    `,
    data(){
        return {
            erros: [],
            status: ''
            }
    },
    methods:{
        uploadPhoto: function() {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                'X-CSRFToken': token
                },
                credentials: 'same-origin'
                }).then(function (response) {
                    return response.json();
                    })
                    .then(function (jsonResponse) {
                    // display a success/error messagemessage
                    if(jsonResponse.hasOwnProperty('message')){
                        self.status='success';
                    }else{
                        self.status='danger';
                        self.erros=jsonResponse.errors;

                    }
                    console.log(jsonResponse);
                    })
                    .catch(function (error) {
                    self.status='danger';
                    console.error(error);
                    self.erros = error;

                    });
        }

    }
}
const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/upload", component: uploadForm },

    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');