import axios from "axios";
import { io } from "socket.io-client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
import './PublicSpace.css'; // Styling for the PublicSpace component

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const PublicSpace = () => {
    const [contents, setContents] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [sidebarSlideIn, setSidebarSlideIn] = useState(true);

    useEffect(() => {
        // Fetch content initially when component mounts
        fetchContent();
        
        // Listen for new content from socket
        socket.on('content', (data) => {
            setContents((prevContents) => [...prevContents, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchContent = async () => {
        try {
            // Fetch all content from the server
            const response = await axios.get('http://localhost:5000/content/fetch');
            setContents(response.data.content);
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const uploadContent = async () => {
        if (text.trim() || file) {
            try {
                let contentType;
                let contentData;
    
                if (text.trim()) {
                    contentType = 'text';
                    contentData = text;
                }
    
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const response = await axios.post('http://localhost:5000/content/upload', formData);

                    contentType = 'file';
                    contentData = response.data.content.contentData; // Ensure correct property access
                }
    
                console.log('Sending content:', { type: contentType, contentData });
    
                socket.emit('content', { type: contentType, contentData });
    
                setText('');
                setFile(null);

                // Fetch updated content after uploading
                fetchContent();
            } catch (error) {
                console.error("Error uploading content:", error);
            }
        }
    };
    
    const renderContent = () => {
        return contents.map((content, index) => (
            <div key={index}>
                <span>{content.user ? content.user.name + ': ' : ''}</span>
                <span>{content.contentType === 'text' ? content.contentData : <img src={`http://localhost:5000/${content.contentData}`} alt="Uploaded File" />}</span>
            </div>
        ));
    };

    const handleSidebarToggle = () => {
        setSidebarSlideIn(!sidebarSlideIn);
    };

    return (
        <div className="chat-1">
            <LeftSidebar slideIn={sidebarSlideIn} handleSlideIn={handleSidebarToggle} />
            <div className="chat-2">
                <div>{renderContent()}</div>
                <form>
                    <div className='form'>
                        <input type="text" value={text} onChange={handleTextChange} placeholder="Enter text..." />
                        <label htmlFor="file-input" className="file-upload">
                            <FontAwesomeIcon icon={faFileImage} className='icon' />
                        </label>
                        <input id="file-input" type="file" onChange={handleFileChange} accept="image/*, video/*" style={{ display: 'none' }} />
                        <button type="button" onClick={uploadContent}>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublicSpace;

