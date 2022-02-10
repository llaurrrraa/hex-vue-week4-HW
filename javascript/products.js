import pagination from './pagination.js';

let productModal = {};
let deleteModal = {};
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'llaurrrraa-hexschool';

const app = Vue.createApp({
    data(){
        return{
            text:'Hello World',
            products: [],
            isNew:false,
            tempProduct : {
                imagesUrl: []
            },
            pagination:{},
        }
    },
    components:{
        pagination
    },
    methods:{
        checkAdmin(){
            const url = `${apiUrl}/api/user/check`;
            axios.post(url)
                .then( res => {
                    console.log(res);
                    this.getData();
                })
                .catch( err => {
                    alert(err.data);
                    window.location = 'index.html';
                })
        },
        getData(page = 1){ // 參數預設值
            // query
            const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then( res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch( err => {
                    alert(err.data);
                })
        },
        openModal(status, product){
            if( status === 'isNew'){
                productModal.show();
                this.tempProduct = {
                    imagesUrl: []
                };
                this.isNew = true;
            }else if( status === 'edit'){
                this.tempProduct = {...product};
                productModal.show();
                this.isNew = false;
            }else if( status === 'delete'){
                this.tempProduct = {...product};
                deleteModal.show();
            }
        },
    },
    mounted(){
        // 取出 token 
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // 放在 headers 裡
        axios.defaults.headers.common.Authorization = token;
        // authorize
        this.checkAdmin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        deleteModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
});

app.component('productModal',{
    props:['tempProduct','isNew'],
    template:'#templateForProductModal',
    methods:{
        updateProduct(){
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let method = 'post';

            if (!this.isNew){
                method = 'put';
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
            }
            axios[method](url, { data : this.tempProduct })
                .then( res => {
                    this.$emit('getProducts');
                    productModal.hide();
                })
                .catch( err => {
                    alert(err.data);
                })
        }
    }
});
app.component('delProductModal',{
    props:['tempProduct'],
    template:`#templateForDelProduct`,
    methods:{
        deleteProduct(){
            const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then( res => {
                    deleteModal.hide();
                    // this.getData();
                    this.$emit('getData');
                })
                .catch ( err => {
                    alert(err.data.message);
                })
        }
    }
})

app.mount('#app');