
let apiPath = 'llaurrrraa-hexschool';

const app = Vue.createApp({
    data(){
        return{
            text:'Login',
            user:{
                username:'',
                password:''
            },
        }
    },
    methods:{
        login(){
            const apiUrl = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(apiUrl, this.user)
                .then(res => {
                    const { token, expired } = res.data;
                    document.cookie = `myToken=${token}; expires=${new Date(expired)}`;
                    window.location = 'products.html';
                })
                .catch(err => {
                    alert('登入失敗');
                    console.dir(err);
                })
        }
    },
});

app.mount('#app');