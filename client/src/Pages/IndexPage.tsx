import Header from "../Components/Header";
import { useState } from "react";

export default function HomePage() {
    const [selectSchemaId, setSelectSchemaId] = useState("1");
    const [content, setContent] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2400/schema', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    schemaId: selectSchemaId,
                    content: content
                })
            });
            if (response.ok) {
                console.log("heeererere");
                console.log(response);
            } else {
                // errorrs
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="px-10">
            <Header/>
            <div className="grid grid-cols-6 mt-10 w-screen gap-10">
                {/* Schema list */}
                <div className="col-span-3 bg-fuchsia-100 rounded-md p-5">
                    <div className=" col-span-3">
                        <h1 className="font-bold underline">Schema List</h1>
                        <select value={selectSchemaId} onChange={e => setSelectSchemaId(e.target.value)} >
                            <option value="1">Schema 1</option>
                            <option value="2">Schema 2</option>
                            <option value="3">Schema 3</option>
                            <option value="4">Schema 4</option>
                        </select>
                    </div>
                    <div className=" col-span-3">
                        <h1 className="font-bold underline">Producer</h1>
                        <form onSubmit={handleFormSubmit}>
                            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-md my-4 px-3" rows={15}></textarea>
                            <div className=" grid grid-cols-6">
                                <div className=" col-span-3">
                                    <h1>Response results</h1>
                                </div>
                                <div className=" col-span-3">
                                    <button type="submit" className=" bg-blue-500 hover:bg-blue-700 rounded-md text-white px-4 py-1">Send to server</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Consumer */}
                <div className="col-span-3 bg-green-100 p-5">
                    <h1>Consumers</h1>
                </div>
            </div>
        </div>
    );  
}
