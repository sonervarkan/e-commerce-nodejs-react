
import api from "./axios";

const categoryApi = {
    getCategories : () => api.get("/categories")
};

export default categoryApi;