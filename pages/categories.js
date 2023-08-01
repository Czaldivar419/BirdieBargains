import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
    const[editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const[parentCategory, setParentCategory] = useState("");
    const[categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories() {
        axios.get("/api/categories").then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev) {
        ev.preventDefault();
        if (editedCategory) {
            await axios.put("/api/categories", )
            } else{
            await axios.post("/api/categories", {
                name, parentCategory
            });
        }
        await axios.post("/api/categories", {name, parentCategory});
        setName("");
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }


    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory
                ? `Edit category ${editedCategory.name}`
                : "Create new Category"}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder={"Category Name"}
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
                <select 
                className="mb-0" 
                onChange={ev => setParentCategory(ev.target.value)}
                value={parentCategory}>
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map
                    (category => (
                        <option value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table class="min-w-full text-left text-sm font-light">
                        <thead class="border-b font-medium dark:border-neutral-500">
                            <tr>
                            <th scope="col" class="px-6 py-4">Category</th>
                            <th scope="col" class="px-6 py-4">Parent Category</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 && categories.map(category => (
                            <tr class="border-b dark:border-neutral-500">
                            <td class="whitespace-nowrap px-6 py-4 font-medium">{category.name}</td>
                            <td class="whitespace-nowrap px-6 py-4">{category?.parent?.name}</td>
                            <td>
                                <button 
                                onClick={() => editCategory(category)}
                                className="btn-primary mr-2">Edit</button>
                                <button className="btn-primary">Delete</button>
                            </td>
                            </tr>
                            ))};
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
        </Layout>
    );
}