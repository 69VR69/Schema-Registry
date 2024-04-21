import { Consumer } from "kafkajs";
import Header from "../Components/Header";
import { useState, useEffect } from "react";


export default function HomePage({consumer} : {consumer: Consumer}) {
    const [selectSchemaId, setSelectSchemaId] = useState(1);
    const [content, setContent] = useState("");
    const [schemaList, setSchemaList] = useState([]);
    const [messageResult, setMessageResult] = useState({ text: "", type: "" });
    const [messages, setMessages] = useState<string[]>([]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2400/data', {
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
                setMessageResult({ text: 'Data sent to Kafka successfully', type: 'success' });
            } else {
                setMessageResult({ text: 'Failed to send data to Kafka', type: 'error' });
            }
        } catch (error) {
            setMessageResult({ text: 'An error occurred while sending data', type: 'error' });
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchSchemaList = async () => {
            try {
                const response = await fetch('http://localhost:2400/schema');
                if (response.ok) {
                    const data = await response.json();
                    setSchemaList(data);
                } else {
                    // Handle errors
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSchemaList();

        const kafka = async () => {
        await consumer.connect()
        await consumer.subscribe({ topic: '.*' })
      
        await consumer.run({
            eachMessage: async ({ message }: { message: { value: { toString: () => string } } }) => {
                console.log('Received message', message.value.toString())
                setMessages([...messages, message.value.toString()]);
            },
        })}

        kafka();
    }, [consumer, messages]);

    return (
        <div className="px-10">
            <Header />
            <div className="grid grid-cols-6 mt-10 w-screen gap-10">
                {/* Schema list */}
                <div className="col-span-3 bg-fuchsia-100 rounded-md p-5">
                    <div className=" col-span-3">
                        <h1 className="font-bold underline">Schema List</h1>
                        <select value={selectSchemaId} onChange={e => setSelectSchemaId(Number(e.target.value))} >
                            {schemaList.map(schema => (
                                <option key={schema.id} value={schema.id}>{schema.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className=" col-span-3">
                        <h1 className="font-bold underline">Producer</h1>
                        <form onSubmit={handleFormSubmit}>
                            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-md my-4 px-3" rows={15}></textarea>
                            <div className=" grid grid-cols-6">
                                <div className=" col-span-3">
                                    <h1>Response results</h1>
                                    <div className={messageResult.type === 'success' ? 'text-green-500' : 'text-red-500'}>{messageResult.text}</div>
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
                    <div className="grid grid-cols-6">
                        <div className=" col-span-3">
                            <h1>Consumer 1</h1>
                            <div className="bg-white p-5 rounded-md">
                                    {messages.map((message, index) => (
                                        <p key={index}>{message}</p>
                                    ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
