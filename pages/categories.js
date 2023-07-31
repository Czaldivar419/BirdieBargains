import Layout from "@/components/layout";
import { useState } from "react";
import axios from "axios";

export default function Categories() {
    const [name, setName] = useState("");
    async function saveCategory(ev) {
        ev.preventDefault();
        await axios.post("/api/categories", {name});
        setName("");

    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>New Category Name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder={"Category Name"}
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
        </Layout>
    );
}