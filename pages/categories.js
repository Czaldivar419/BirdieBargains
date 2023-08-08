import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

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
        const data = {
            name, 
            parentCategory, 
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(",")
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
            } else {
            await axios.post("/api/categories", data);
            }
        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(",")
            }))
        );
    }
    function deleteCategory(category) {
        swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete",
            confirmButtonColor: "#800000",
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete("/api/categories?_id=" + _id);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: "", values:""}]
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values =newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory
                ? `Edit category ${editedCategory.name}`
                : "Create new Category"}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                <input 
                    type="text" 
                    placeholder={"Category Name"}
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
                <select 
                onChange={ev => setParentCategory(ev.target.value)}
                value={parentCategory}>
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map
                    (category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button 
                    onClick={addProperty}
                    type="button" 
                    className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text"
                                        value={property.name}
                                        className="mb-0"
                                        onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                        placeholder="property name (example: color)"/>
                            <input type="text" 
                                        value={property.values}
                                        className="mb-0"
                                        onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                        placeholder="values, comma seperated"/>
                                    <button 
                                        className="btn-default"
                                        type="button"
                                        onClick={() => removeProperty(index)}>
                                            Remove
                                    </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                {editedCategory && (
                    <button
                        type="button" 
                        onClick={() => {
                            setEditedCategory(null);
                            setName("");
                            setParentCategory("");
                            setProperties([]);
                        }}
                        className="btn-default">
                         Cancel
                    </button>
                )}
                    <button 
                        type="submit" 
                        className="btn-primary py-1">
                        Save
                    </button>
                </div>
            </form>
            {!editedCategory && (
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
                                        <tr key={category._id} class="border-b dark:border-neutral-500">
                                            <td class="whitespace-nowrap px-6 py-4 font-medium">{category.name}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{category?.parent?.name}</td>
                                            <td>
                                                <button 
                                                    onClick={() => editCategory(category)}
                                                    className="btn-primary mr-2">Edit</button>
                                                <button
                                                    onClick={() => deleteCategory(category)}
                                                    className="btn-primary">Delete</button>
                                            </td>
                                        </tr>
                                    ))};
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Layout>
);
}

export default withSwal(({ swal }, ref) => (
<Categories swal={swal} />
));

                